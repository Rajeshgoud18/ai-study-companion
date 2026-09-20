import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getProject } from "../services/projectService.js";
import api from "../services/api.js";

import "./Knowledge.css";

function Knowledge() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [growth, setGrowth] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const userName =
        localStorage.getItem("name") || "Learner";

    useEffect(() => {
        const loadKnowledge = async () => {
            try {
                setLoading(true);
                setError("");

                const [projectResponse, growthResponse] =
                    await Promise.all([
                        getProject(projectId),
                        api.get(
                            `/ai/growth?projectId=${projectId}`
                        )
                    ]);

                setProject(projectResponse);
                setGrowth(growthResponse.data);

                console.log(
                    "Knowledge / Growth:",
                    growthResponse.data
                );

            } catch (error) {
                console.error(
                    "Failed to load knowledge:",
                    error
                );

                setError(
                    "Unable to load project knowledge."
                );
            } finally {
                setLoading(false);
            }
        };

        loadKnowledge();
    }, [projectId]);

    const goTo = (page) => {
        navigate(`/project/${projectId}/${page}`);
    };

    const getMastery = (value) => {
        if (value === undefined || value === null) {
            return 0;
        }

        return Math.round(value * 100);
    };

    const getStatus = (mastery) => {
        if (mastery >= 70) {
            return "Strong";
        }

        if (mastery >= 40) {
            return "Developing";
        }

        return "Needs attention";
    };

    if (loading) {
        return (
            <div className="knowledge-loading">
                <div className="knowledge-spinner"></div>
                <h2>Loading knowledge...</h2>
            </div>
        );
    }

    const concepts = growth?.concepts || [];
    const mastery = Math.round((concepts.mastery ?? 0) * 100);

    const name = concepts.conceptName;

    const status = concepts.status;


    return (
        <div className="knowledge-page">

            {/* SIDEBAR */}

            <aside className="knowledge-sidebar">

                <div className="knowledge-brand">
                    <div className="knowledge-brand-icon">
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

                <div className="sidebar-label">
                    WORKSPACE
                </div>

                <button
                    className="sidebar-item"
                    onClick={() => navigate("/home")}
                >
                    <span>⌂</span>
                    Home
                </button>

                <button
                    className="sidebar-item"
                    onClick={() => navigate("/spaces")}
                >
                    <span>▱</span>
                    Spaces
                </button>

                <button
                    className="sidebar-item"
                    onClick={() => navigate("/projects")}
                >
                    <span>◫</span>
                    Projects
                </button>

                <div className="sidebar-label project-label">
                    CURRENT PROJECT
                </div>

                <div className="knowledge-project">
                    <div className="project-icon">
                        ✦
                    </div>

                    <div>
                        <strong>
                            {project?.name}
                        </strong>

                        <span>
                            Current project
                        </span>
                    </div>
                </div>

                <nav className="knowledge-project-nav">


                    <button
                        onClick={() =>
                            goTo("materials")
                        }
                    >
                        <span>▤</span>
                        Materials
                    </button>

                    <button className="active">
                        <span>◇</span>
                        Knowledge
                    </button>

                    <button
                        onClick={() =>
                            goTo("tutor")
                        }
                    >
                        <span>✦</span>
                        AI Tutor
                    </button>

                    <button
                        onClick={() =>
                            goTo("quiz")
                        }
                    >
                        <span>✓</span>
                        Quiz
                    </button>

                    <button
                        onClick={() =>
                            goTo("assessment")
                        }
                    >
                        <span>◇</span>
                        Assessment
                    </button>

                    <button
                        onClick={() =>
                            goTo("mastery")
                        }
                    >
                        <span>◉</span>
                        Mastery
                    </button>

                    <button
                        onClick={() =>
                            goTo("growth")
                        }
                    >
                        <span>↗</span>
                        Growth
                    </button>

                    <button
                        onClick={() =>
                            goTo("analytics")
                        }
                    >
                        <span>⌁</span>
                        Analytics
                    </button>

                </nav>

                <div className="knowledge-sidebar-bottom">

                    <div className="knowledge-user">

                        <div className="user-avatar">
                            {userName
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div>
                            <strong>
                                {userName}
                            </strong>

                            <span>
                                Learner
                            </span>
                        </div>

                    </div>

                </div>

            </aside>

            {/* MAIN */}

            <main className="knowledge-main">

                <header className="knowledge-topbar">

                    <div className="knowledge-breadcrumbs">

                        <button
                            onClick={() =>
                                navigate("/home")
                            }
                        >
                            Home
                        </button>

                        <span>—</span>

                        <button
                            onClick={() =>
                                navigate(
                                    `/project/${projectId}`
                                )
                            }
                        >
                            {project?.name}
                        </button>

                        <span>—</span>

                        <strong>
                            Knowledge
                        </strong>

                    </div>

                    <div className="knowledge-avatar">
                        {userName
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                </header>

                <div className="knowledge-content">

                    <div className="knowledge-header">

                        <div>

                            <div className="knowledge-eyebrow">
                                PROJECT KNOWLEDGE
                            </div>

                            <h1>
                                Knowledge
                            </h1>

                            <p>
                                Understand the concepts
                                you're learning and how
                                well you've mastered them.
                            </p>

                        </div>

                    </div>

                    {error && (
                        <div className="knowledge-error">
                            {error}
                        </div>
                    )}

                    {/* SUMMARY */}

                    <div className="knowledge-summary">

                        <div className="knowledge-summary-card">

                            <span>
                                Overall Mastery
                            </span>

                            <strong>
                                {getMastery(
                                    growth?.overallMastery
                                )}%
                            </strong>

                            <small>
                                Current understanding
                            </small>

                        </div>

                        <div className="knowledge-summary-card">

                            <span>
                                Concepts
                            </span>

                            <strong>
                                {concepts.length}
                            </strong>

                            <small>
                                Identified in your learning
                            </small>

                        </div>

                        <div className="knowledge-summary-card">

                            <span>
                                Learning Status
                            </span>

                            <strong className="status-text">
                                {getStatus(
                                    getMastery(
                                        growth?.overallMastery
                                    )
                                )}
                            </strong>

                            <small>
                                Based on current mastery
                            </small>

                        </div>

                    </div>

                    {/* CONCEPTS */}

                    <section className="concept-section">

                        <div className="concept-header">

                            <div>
                                <div className="knowledge-eyebrow">
                                    CONCEPT MASTERY
                                </div>

                                <h2>
                                    What you're learning
                                </h2>
                            </div>

                        </div>

                        {concepts.length === 0 ? (

                            <div className="knowledge-empty">

                                <div className="empty-icon">
                                    ◇
                                </div>

                                <h3>
                                    No concepts available yet
                                </h3>

                                <p>
                                    Upload learning materials
                                    and interact with the tutor
                                    to build your project
                                    knowledge.
                                </p>

                                <button
                                    onClick={() =>
                                        goTo("materials")
                                    }
                                >
                                    Add Materials →
                                </button>

                            </div>

                        ) : (

                            <div className="concept-list">

                                {concepts.map((concept) => {
                                    const mastery = Math.round((concept.mastery ?? 0) * 100);

                                    return (
                                        <div className="concept-card" key={concept.conceptId}>
                                            <div className="concept-card-header">
                                                <div>
                                                    <h3>{concept.conceptName}</h3>
                                                    <span className={`concept-status ${concept.status.toLowerCase().replace("_", "-")}`}>
                                                        {concept.status.replace("_", " ")}
                                                    </span>
                                                </div>

                                                <strong>{mastery}%</strong>
                                            </div>

                                            <div className="concept-progress">
                                                <div
                                                    className="concept-progress-fill"
                                                    style={{ width: `${mastery}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}

                            </div>
                        )}

                    </section>

                </div>

            </main>

        </div>
    );
}

export default Knowledge;