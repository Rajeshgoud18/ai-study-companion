import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getUserSpaces } from "../services/spaceService.js";
import {
    getProjects,
    createProject
} from "../services/projectService.js";
import "./Projects.css";

export default function Projects() {

    const { user } = useAuth();
    const navigate = useNavigate();

    const [spaces, setSpaces] = useState([]);
    const [projects, setProjects] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ================================
    // CREATE PROJECT STATE
    // ================================

    const [showCreateModal, setShowCreateModal] = useState(false);

    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [learningGoal, setLearningGoal] = useState("");
    const [selectedSpaceId, setSelectedSpaceId] = useState("");

    const [creatingProject, setCreatingProject] = useState(false);
    const [createError, setCreateError] = useState("");

    // ================================
    // LOAD PROJECTS
    // ================================

    useEffect(() => {

        const loadProjects = async () => {

            if (!user?.userId) {
                return;
            }

            try {

                setLoading(true);
                setError("");

                const userSpaces = await getUserSpaces();

                setSpaces(userSpaces);

                if (userSpaces.length === 0) {
                    setProjects([]);
                    return;
                }

                const projectResponses =
                    await Promise.all(
                        userSpaces.map((space) =>
                            getProjects(space.id)
                        )
                    );

                const allProjects =
                    projectResponses.flat();

                setProjects(allProjects);

            } catch (error) {

                console.error(
                    "Failed to load projects:",
                    error
                );

                setError(
                    "Unable to load your projects."
                );

            } finally {

                setLoading(false);

            }
        };

        loadProjects();

    }, [user]);

    // ================================
    // SPACE NAME
    // ================================

    const getProjectSpaceName = (project) => {

        const space =
            spaces.find(
                (item) =>
                    item.id === project.spaceId
            );

        return space?.name || "Learning space";
    };

    // ================================
    // OPEN CREATE MODAL
    // ================================

    const openCreateModal = () => {

        setProjectName("");
        setProjectDescription("");
        setLearningGoal("");
        setCreateError("");

        if (spaces.length > 0) {
            setSelectedSpaceId(String(spaces[0].id));
        } else {
            setSelectedSpaceId("");
        }

        setShowCreateModal(true);
    };

    // ================================
    // CLOSE CREATE MODAL
    // ================================

    const closeCreateModal = () => {

        if (creatingProject) {
            return;
        }

        setShowCreateModal(false);
        setCreateError("");
    };

    // ================================
    // CREATE PROJECT
    // ================================

    const handleCreateProject = async (event) => {

        event.preventDefault();

        if (!projectName.trim()) {
            setCreateError(
                "Project name is required."
            );
            return;
        }

        if (!selectedSpaceId) {
            setCreateError(
                "Please select a learning space."
            );
            return;
        }

        try {

            setCreatingProject(true);
            setCreateError("");

            const newProject =
                await createProject(
                    Number(selectedSpaceId),
                    projectName.trim(),
                    projectDescription.trim(),
                    learningGoal.trim()
                );

            // Add newly created project immediately
            setProjects((currentProjects) => [
                ...currentProjects,
                newProject
            ]);

            setShowCreateModal(false);

            setProjectName("");
            setProjectDescription("");
            setLearningGoal("");
            setSelectedSpaceId("");

        } catch (error) {

            console.error(
                "Failed to create project:",
                error
            );

            setCreateError(
                error?.response?.data?.message ||
                "Unable to create project."
            );

        } finally {

            setCreatingProject(false);

        }
    };

    return (
        <div className="projects-page">

            {/* ================================
                SIDEBAR
            ================================= */}

            <aside className="projects-sidebar">

                <div className="projects-brand">

                    <div className="projects-brand-icon">
                        ✦
                    </div>

                    <div>
                        <strong>
                            AI Study Companion
                        </strong>

                        <span>
                            Learn smarter
                        </span>
                    </div>

                </div>

                <div className="projects-sidebar-section">

                    <span className="projects-label">
                        WORKSPACE
                    </span>

                    <button
                        className="projects-nav-item"
                        onClick={() =>
                            navigate("/home")
                        }
                    >
                        <span>⌂</span>
                        Home
                    </button>

                    <button
                        className="projects-nav-item"
                        onClick={() =>
                            navigate("/spaces")
                        }
                    >
                        <span>▱</span>
                        Spaces
                    </button>

                    <button
                        className="projects-nav-item active"
                    >
                        <span>◫</span>
                        Projects
                    </button>

                </div>

                <div className="projects-sidebar-bottom">

                    <div className="projects-user">

                        <div className="projects-avatar">
                            {user?.name
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}
                        </div>

                        <div>
                            <strong>
                                {user?.name}
                            </strong>

                            <span>
                                Learner
                            </span>
                        </div>

                    </div>

                </div>

            </aside>

            {/* ================================
                MAIN
            ================================= */}

            <main className="projects-main">

                <header className="projects-topbar">

                    <div className="projects-breadcrumbs">
                        <span>Home</span>
                        <span>/</span>
                        <strong>Projects</strong>
                    </div>

                    <div className="projects-topbar-avatar">
                        {user?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "U"}
                    </div>

                </header>

                <section className="projects-content">

                    {/* ================================
                        HEADING
                    ================================= */}

                    <div className="projects-heading">

                        <div>

                            <span className="projects-eyebrow">
                                YOUR WORKSPACE
                            </span>

                            <h1>
                                Projects
                            </h1>

                            <p>
                                Your learning projects across
                                all your spaces.
                            </p>

                        </div>

                        <button
                            className="create-project-button"
                            onClick={openCreateModal}
                            disabled={spaces.length === 0}
                        >
                            <span className="create-project-plus">
                                +
                            </span>

                            Create Project
                        </button>

                    </div>

                    {/* ERROR */}

                    {error && (
                        <div className="projects-error">
                            {error}
                        </div>
                    )}

                    {/* ================================
                        PROJECTS
                    ================================= */}

                    {loading ? (

                        <div className="projects-loading">
                            Loading your projects...
                        </div>

                    ) : projects.length === 0 ? (

                        <div className="projects-empty">

                            <div className="projects-empty-icon">
                                ◫
                            </div>

                            <h2>
                                No projects yet
                            </h2>

                            <p>
                                Create your first learning
                                project to get started.
                            </p>

                            {spaces.length === 0 ? (

                                <button
                                    onClick={() =>
                                        navigate("/spaces")
                                    }
                                >
                                    Create a space first →
                                </button>

                            ) : (

                                <button
                                    onClick={openCreateModal}
                                >
                                    Create your first project →
                                </button>

                            )}

                        </div>

                    ) : (

                        <div className="projects-grid">

                            {projects.map((project) => (

                                <button
                                    key={project.id}
                                    className="project-card"
                                    onClick={() =>
                                        navigate(
                                            `/project/${project.id}`
                                        )
                                    }
                                >

                                    <div className="project-card-top">

                                        <div className="project-card-icon">
                                            ◈
                                        </div>

                                        <span>
                                            →
                                        </span>

                                    </div>

                                    <div className="project-card-body">

                                        <h2>
                                            {project.name}
                                        </h2>

                                        <p>
                                            {project.description ||
                                                "No description provided."}
                                        </p>

                                    </div>

                                    <div className="project-card-footer">

                                        <span>
                                            {getProjectSpaceName(
                                                project
                                            )}
                                        </span>

                                    </div>

                                </button>

                            ))}

                        </div>

                    )}

                </section>

            </main>

            {/* ================================
                CREATE PROJECT MODAL
            ================================= */}

            {showCreateModal && (

                <div
                    className="project-modal-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeCreateModal();
                        }

                    }}
                >

                    <div className="project-modal">

                        <div className="project-modal-header">

                            <div>

                                <span className="project-modal-eyebrow">
                                    NEW LEARNING PROJECT
                                </span>

                                <h2>
                                    Create Project
                                </h2>

                                <p>
                                    Set up a focused learning
                                    journey inside a space.
                                </p>

                            </div>

                            <button
                                className="project-modal-close"
                                onClick={closeCreateModal}
                                disabled={creatingProject}
                            >
                                ×
                            </button>

                        </div>

                        <form
                            onSubmit={handleCreateProject}
                            className="project-create-form"
                        >

                            {/* PROJECT NAME */}

                            <div className="project-form-group">

                                <label>
                                    Project Name
                                </label>

                                <input
                                    type="text"
                                    value={projectName}
                                    onChange={(event) =>
                                        setProjectName(
                                            event.target.value
                                        )
                                    }
                                    placeholder="e.g. Spring Boot Mastery"
                                    autoFocus
                                />

                            </div>

                            {/* DESCRIPTION */}

                            <div className="project-form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    value={projectDescription}
                                    onChange={(event) =>
                                        setProjectDescription(
                                            event.target.value
                                        )
                                    }
                                    placeholder="What will you learn in this project?"
                                    rows="3"
                                />

                            </div>

                            {/* LEARNING GOAL */}

                            <div className="project-form-group">

                                <label>
                                    Learning Goal
                                </label>

                                <textarea
                                    value={learningGoal}
                                    onChange={(event) =>
                                        setLearningGoal(
                                            event.target.value
                                        )
                                    }
                                    placeholder="What do you want to achieve?"
                                    rows="3"
                                />

                            </div>

                            {/* SPACE */}

                            <div className="project-form-group">

                                <label>
                                    Learning Space
                                </label>

                                <select
                                    value={selectedSpaceId}
                                    onChange={(event) =>
                                        setSelectedSpaceId(
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select a space
                                    </option>

                                    {spaces.map((space) => (

                                        <option
                                            key={space.id}
                                            value={space.id}
                                        >
                                            {space.name}
                                        </option>

                                    ))}

                                </select>

                            </div>

                            {/* ERROR */}

                            {createError && (

                                <div className="project-create-error">
                                    {createError}
                                </div>

                            )}

                            {/* ACTIONS */}

                            <div className="project-modal-actions">

                                <button
                                    type="button"
                                    className="project-cancel-button"
                                    onClick={closeCreateModal}
                                    disabled={creatingProject}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="project-submit-button"
                                    disabled={creatingProject}
                                >
                                    {creatingProject
                                        ? "Creating..."
                                        : "Create Project"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}