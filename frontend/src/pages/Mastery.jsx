import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";
import { getProject } from "../services/projectService.js";
import "./Mastery.css";

export default function Mastery() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [growth, setGrowth] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadMastery();
    }, [projectId]);

    const loadMastery = async () => {
        try {
            setLoading(true);

            const [projectResponse, growthResponse] =
                await Promise.all([
                    getProject(projectId),
                    api.get(`/ai/growth?projectId=${projectId}`)
                ]);

            setProject(projectResponse);
            setGrowth(growthResponse.data);

        } catch (err) {
            console.error("Failed to load mastery:", err);

            setError(
                err?.response?.data?.message ||
                "Failed to load mastery data."
            );
        } finally {
            setLoading(false);
        }
    };

    const go = (path) => {
        navigate(`/project/${projectId}/${path}`);
    };

    const concepts = growth?.concepts || [];

    const overallMastery = Math.round(
        (growth?.overallMastery ?? 0) * 100
    );

    const strong = concepts.filter(
        (concept) => concept.status === "STRONG"
    );

    const developing = concepts.filter(
        (concept) => concept.status === "DEVELOPING"
    );

    const attention = concepts.filter(
        (concept) => concept.status === "NEEDS_ATTENTION"
    );

    const statusClass = (status) => {
        if (status === "STRONG") return "strong";
        if (status === "DEVELOPING") return "developing";
        return "attention";
    };

    if (loading) {
        return (
            <div className="mastery-page">
                <div className="mastery-loading">
                    Loading mastery...
                </div>
            </div>
        );
    }

    return (
        <div className="mastery-page">

            {/* ================= SIDEBAR ================= */}

            <aside className="sidebar">

                <div className="sidebar-brand">
                    <div className="brand-icon">✦</div>

                    <div>
                        <strong>AI Study Companion</strong>
                        <span>Learn smarter</span>
                    </div>
                </div>

                <div className="sidebar-section">

                    <span className="sidebar-label">
                        WORKSPACE
                    </span>

                    <button
                        className="project-nav-item"
                        onClick={() => navigate("/home")}
                    >
                        <span>⌂</span>
                        Home
                    </button>

                    <button
                        className="project-nav-item"
                        onClick={() => navigate("/spaces")}
                    >
                        <span>▦</span>
                        Spaces
                    </button>

                    <button
                        className="project-nav-item"
                        onClick={() => navigate("/projects")}
                    >
                        <span>▣</span>
                        Projects
                    </button>

           
                </div>

                <div className="sidebar-section">

                    <span className="sidebar-label">
                        CURRENT PROJECT
                    </span>

                    <div className="current-project">

                        <div className="project-dot"></div>

                        <div>
                            <strong>
                                {project?.name || "Project"}
                            </strong>

                            <span>
                                Current project
                            </span>
                        </div>

                    </div>

 
                    <button
                        className="project-nav-item"
                        onClick={() => go("materials")}
                    >
                        <span>▤</span>
                        Materials
                    </button>

                    <button
                        className="project-nav-item"
                        onClick={() => go("knowledge")}
                    >
                        <span>◇</span>
                        Knowledge
                    </button>

                    <button
                        className="project-nav-item"
                        onClick={() => go("tutor")}
                    >
                        <span>✦</span>
                        AI Tutor
                    </button>

                    <button
                        className="project-nav-item"
                        onClick={() => go("quiz")}
                    >
                        <span>✓</span>
                        Quiz
                    </button>

                    <button
                        className="project-nav-item"
                        onClick={() => go("assessment")}
                    >
                        <span>✎</span>
                        Assessment
                    </button>

                    <button className="project-nav-item active">
                        <span>◉</span>
                        Mastery
                    </button>

                    <button
                        className="project-nav-item"
                        onClick={() => go("growth")}
                    >
                        <span>↗</span>
                        Growth
                    </button>

                    <button
                        className="project-nav-item"
                        onClick={() => go("analytics")}
                    >
                        <span>◔</span>
                        Analytics
                    </button>

                </div>

                <div className="sidebar-bottom">

                    <button
                        className="project-nav-item"
                        onClick={() => navigate("/home")}
                    >
                        <span>←</span>
                        Back to dashboard
                    </button>

                    <div className="user-profile">

                        <div className="user-avatar">
                            R
                        </div>

                        <div>
                            <strong>Rajesh</strong>
                            <span>Student</span>
                        </div>

                    </div>

                </div>

            </aside>

            {/* ================= MAIN ================= */}

            <main className="mastery-main">

                <header className="mastery-topbar">

                    <div className="breadcrumbs">
                        <span>Projects</span>
                        <span>/</span>
                        <strong>
                            {project?.name || "Project"}
                        </strong>
                        <span>/</span>
                        <strong>Mastery</strong>
                    </div>

                    <div className="topbar-actions">

                        <button className="topbar-icon">
                            ?
                        </button>

                        <div className="topbar-avatar">
                            R
                        </div>

                    </div>

                </header>

                <section className="mastery-content">

                    {/* HEADER */}

                    <div className="mastery-heading">

                        <div>
                            <span className="mastery-eyebrow">
                                CONCEPT MASTERY
                            </span>

                            <h1>
                                Know what you know
                            </h1>

                            <p>
                                Track your understanding of every concept
                                in this project.
                            </p>
                        </div>

                    </div>

                    {error && (
                        <div className="mastery-error">
                            {error}
                        </div>
                    )}

                    {/* ================= OVERALL ================= */}

                    <section className="mastery-overview">

                        <div className="mastery-score-card">

                            <div className="mastery-score-content">

                                <span className="card-label">
                                    OVERALL MASTERY
                                </span>

                                <div className="mastery-score">
                                    {overallMastery}%
                                </div>

                                <div className="mastery-status">
                                    <span></span>

                                    {growth?.overallStatus?.replace(
                                        "_",
                                        " "
                                    )}
                                </div>

                                <p>
                                    Your current mastery across all
                                    tracked concepts.
                                </p>

                            </div>

                            <div
                                className="mastery-large-ring"
                                style={{
                                    "--mastery":
                                        `${overallMastery}%`
                                }}
                            >
                                <div>
                                    <strong>
                                        {overallMastery}%
                                    </strong>
                                    <span>mastery</span>
                                </div>
                            </div>

                        </div>

                        <div className="mastery-breakdown">

                            <div className="breakdown-card">
                                <span className="breakdown-number strong">
                                    {strong.length}
                                </span>

                                <strong>
                                    Strong
                                </strong>

                                <span>
                                    Concepts you understand well
                                </span>
                            </div>

                            <div className="breakdown-card">
                                <span className="breakdown-number developing">
                                    {developing.length}
                                </span>

                                <strong>
                                    Developing
                                </strong>

                                <span>
                                    Concepts still improving
                                </span>
                            </div>

                            <div className="breakdown-card">
                                <span className="breakdown-number attention">
                                    {attention.length}
                                </span>

                                <strong>
                                    Needs attention
                                </strong>

                                <span>
                                    Concepts to review
                                </span>
                            </div>

                        </div>

                    </section>

                    {/* ================= CONCEPTS ================= */}

                    <section className="mastery-section">

                        <div className="section-heading">

                            <div>
                                <span className="section-eyebrow">
                                    ALL CONCEPTS
                                </span>

                                <h2>
                                    Concept mastery
                                </h2>

                                <p>
                                    See your current mastery level for
                                    every concept.
                                </p>
                            </div>

                            <span className="concept-count">
                                {concepts.length} concepts
                            </span>

                        </div>

                        <div className="mastery-list">

                            {concepts.map((concept) => {

                                const mastery = Math.round(
                                    (concept.mastery ?? 0) * 100
                                );

                                return (
                                    <div
                                        className="mastery-concept"
                                        key={concept.conceptId}
                                    >

                                        <div className="concept-info">

                                            <div className="concept-icon">
                                                ◇
                                            </div>

                                            <div>
                                                <h3>
                                                    {concept.conceptName}
                                                </h3>

                                                <span
                                                    className={`mastery-status-badge ${statusClass(
                                                        concept.status
                                                    )}`}
                                                >
                                                    {concept.status.replace(
                                                        "_",
                                                        " "
                                                    )}
                                                </span>
                                            </div>

                                        </div>

                                        <div className="concept-progress-area">

                                            <div className="concept-progress-label">
                                                <span>
                                                    Mastery
                                                </span>

                                                <strong>
                                                    {mastery}%
                                                </strong>
                                            </div>

                                            <div className="concept-progress">
                                                <div
                                                    className={`concept-progress-fill ${statusClass(
                                                        concept.status
                                                    )}`}
                                                    style={{
                                                        width:
                                                            `${mastery}%`
                                                    }}
                                                />
                                            </div>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                    </section>

                    {/* ================= ACTION ================= */}

                    <section className="mastery-action">

                        <div>
                            <span className="section-eyebrow">
                                KEEP LEARNING
                            </span>

                            <h2>
                                Improve the concepts that need work
                            </h2>

                            <p>
                                Review difficult concepts with the AI
                                Tutor and test yourself again with a quiz.
                            </p>
                        </div>

                        <div className="mastery-action-buttons">

                            <button
                                className="secondary-action"
                                onClick={() => go("tutor")}
                            >
                                Open AI Tutor
                            </button>

                            <button
                                className="primary-action"
                                onClick={() => go("quiz")}
                            >
                                Take a quiz →
                            </button>

                        </div>

                    </section>

                </section>

            </main>

        </div>
    );
}