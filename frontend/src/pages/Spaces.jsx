import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserSpaces } from "../services/spaceService.js";
import { getProjects } from "../services/projectService.js";
import "./Spaces.css";

function Spaces() {
    const navigate = useNavigate();

    const [spaces, setSpaces] = useState([]);
    const [selectedSpace, setSelectedSpace] = useState(null);

    const [projects, setProjects] = useState([]);

    const [loading, setLoading] = useState(true);
    const [projectsLoading, setProjectsLoading] = useState(false);

    const [error, setError] = useState("");

    /* =====================================================
       LOAD SPACES
    ===================================================== */

    useEffect(() => {
        const loadSpaces = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getUserSpaces();

                setSpaces(data);
            } catch (error) {
                console.error(
                    "Failed to load spaces:",
                    error
                );

                setError(
                    "Unable to load your spaces."
                );
            } finally {
                setLoading(false);
            }
        };

        loadSpaces();
    }, []);

    /* =====================================================
       SELECT SPACE
    ===================================================== */

    const handleSpaceSelect = async (space) => {
        try {
            setSelectedSpace(space);
            setProjects([]);
            setProjectsLoading(true);
            setError("");

            const data = await getProjects(space.id);

            setProjects(data);
        } catch (error) {
            console.error(
                "Failed to load projects:",
                error
            );

            setError(
                "Unable to load projects for this space."
            );

            setProjects([]);
        } finally {
            setProjectsLoading(false);
        }
    };

    /* =====================================================
       SELECT PROJECT
    ===================================================== */

    const handleProjectSelect = (project) => {
        navigate(`/project/${project.id}`);
    };

    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
        return (
            <div className="spaces-loading">
                <div className="spaces-spinner"></div>

                <h2>
                    Loading spaces...
                </h2>
            </div>
        );
    }

    /* =====================================================
       UI
    ===================================================== */

    return (
        <div className="spaces-page">

            {/* SIDEBAR */}

            <aside className="spaces-sidebar">

                <div
                    className="spaces-brand"
                    onClick={() => navigate("/home")}
                >
                    <div className="spaces-brand-icon">
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

                <div className="spaces-sidebar-label">
                    WORKSPACE
                </div>

                <nav>

                    <button
                        onClick={() =>
                            navigate("/home")
                        }
                    >
                        <span>⌂</span>
                        Home
                    </button>

                    <button className="active">
                        <span>□</span>
                        Spaces
                    </button>

                    <button
                        onClick={() =>
                            navigate("/projects")
                        }
                    >
                        <span>◫</span>
                        Projects
                    </button>


                </nav>

                <div className="spaces-sidebar-bottom">

                    <div className="spaces-user">

                        <div className="spaces-user-avatar">
                            R
                        </div>

                        <div>
                            <strong>
                                Rajesh
                            </strong>

                            <span>
                                Learner
                            </span>
                        </div>

                    </div>

                </div>

            </aside>

            {/* MAIN */}

            <main className="spaces-main">

                {/* TOPBAR */}

                <header className="spaces-topbar">

                    <div className="spaces-breadcrumb">

                        <button
                            onClick={() =>
                                navigate("/home")
                            }
                        >
                            Home
                        </button>

                        <span>/</span>

                        <strong>
                            Spaces
                        </strong>

                        {selectedSpace && (
                            <>
                                <span>/</span>

                                <strong>
                                    {selectedSpace.name}
                                </strong>
                            </>
                        )}

                    </div>

                    <div className="spaces-avatar">
                        R
                    </div>

                </header>

                {/* CONTENT */}

                <div className="spaces-content">

                    {/* =================================================
                        SPACE LIST
                    ================================================= */}

                    {!selectedSpace && (
                        <>
                            <div className="spaces-header">

                                <div>

                                    <span>
                                        YOUR WORKSPACE
                                    </span>

                                    <h1>
                                        Spaces
                                    </h1>

                                    <p>
                                        Organize your learning around
                                        topics, skills and goals.
                                    </p>

                                </div>

                            </div>

                            {error && (
                                <div className="spaces-error">
                                    {error}
                                </div>
                            )}

                            {spaces.length === 0 ? (
                                <div className="spaces-empty">

                                    <h3>
                                        No spaces yet
                                    </h3>

                                    <p>
                                        Create a learning space to
                                        organize your projects.
                                    </p>

                                </div>
                            ) : (
                                <div className="spaces-grid">

                                    {spaces.map((space) => (

                                        <button
                                            key={space.id}
                                            className="space-card"
                                            onClick={() =>
                                                handleSpaceSelect(
                                                    space
                                                )
                                            }
                                        >

                                            <div className="space-card-icon">
                                                ✦
                                            </div>

                                            <div className="space-card-content">

                                                <h3>
                                                    {space.name}
                                                </h3>

                                                <p>
                                                    {space.description ||
                                                        "Learning space"}
                                                </p>

                                            </div>

                                            <span className="space-card-arrow">
                                                →
                                            </span>

                                        </button>

                                    ))}

                                </div>
                            )}
                        </>
                    )}

                    {/* =================================================
                        SELECTED SPACE
                    ================================================= */}

                    {selectedSpace && (
                        <>

                            <button
                                className="back-to-spaces"
                                onClick={() => {
                                    setSelectedSpace(null);
                                    setProjects([]);
                                    setError("");
                                }}
                            >
                                ← All Spaces
                            </button>

                            <div className="selected-space-header">

                                <span>
                                    SPACE
                                </span>

                                <h1>
                                    {selectedSpace.name}
                                </h1>

                                <p>
                                    {selectedSpace.description ||
                                        "Projects in this learning space."}
                                </p>

                            </div>

                            <div className="projects-heading">

                                <div>
                                    <span>
                                        LEARNING PROJECTS
                                    </span>

                                    <h2>
                                        Projects
                                    </h2>
                                </div>

                                <div className="project-count">
                                    {projects.length}
                                </div>

                            </div>

                            {error && (
                                <div className="spaces-error">
                                    {error}
                                </div>
                            )}

                            {projectsLoading ? (
                                <div className="projects-loading">
                                    <div className="spaces-spinner"></div>

                                    <p>
                                        Loading projects...
                                    </p>
                                </div>
                            ) : projects.length === 0 ? (
                                <div className="projects-empty">

                                    <div className="empty-icon">
                                        ◫
                                    </div>

                                    <h3>
                                        No projects yet
                                    </h3>

                                    <p>
                                        This space doesn't have any
                                        projects yet.
                                    </p>

                                </div>
                            ) : (
                                <div className="projects-grid">

                                    {projects.map((project) => (

                                        <button
                                            key={project.id}
                                            className="project-card"
                                            onClick={() =>
                                                handleProjectSelect(
                                                    project
                                                )
                                            }
                                        >

                                            <div className="project-card-icon">
                                                ✦
                                            </div>

                                            <div className="project-card-content">

                                                <h3>
                                                    {project.name}
                                                </h3>

                                                <p>
                                                    {project.description ||
                                                        "Learning project"}
                                                </p>

                                            </div>

                                            <span className="project-card-arrow">
                                                →
                                            </span>

                                        </button>

                                    ))}

                                </div>
                            )}

                        </>
                    )}

                </div>

            </main>

        </div>
    );
}

export default Spaces;