import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getUserSpaces } from "../services/spaceService.js";
import { getProjects } from "../services/projectService.js";
import "./Projects.css";

export default function Projects() {

    const { user } = useAuth();
    const navigate = useNavigate();

    const [spaces, setSpaces] = useState([]);
    const [projects, setProjects] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadProjects = async () => {

            if (!user?.userId) {
                return;
            }

            try {

                setLoading(true);
                setError("");

                const userSpaces =
                    await getUserSpaces();

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

    const getProjectSpaceName = (project) => {

        const space =
            spaces.find(
                (item) =>
                    item.id === project.spaceId
            );

        return space?.name || "Learning space";
    };

    return (
        <div className="projects-page">

            {/* SIDEBAR */}

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
                        onClick={() => navigate("/home")}
                    >
                        <span>⌂</span>
                        Home
                    </button>

                    <button
                        className="projects-nav-item"
                        onClick={() => navigate("/spaces")}
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
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
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

            {/* MAIN */}

            <main className="projects-main">

                <header className="projects-topbar">

                    <div className="projects-breadcrumbs">
                        <span>Home</span>
                        <span>/</span>
                        <strong>Projects</strong>
                    </div>

                    <div className="projects-topbar-avatar">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                </header>

                <section className="projects-content">

                    <div className="projects-heading">

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

                    {error && (
                        <div className="projects-error">
                            {error}
                        </div>
                    )}

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
                                Create a project inside a
                                learning space to get started.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/spaces")
                                }
                            >
                                View your spaces →
                            </button>

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
                                            {getProjectSpaceName(project)}
                                        </span>

                                    </div>

                                </button>

                            ))}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}