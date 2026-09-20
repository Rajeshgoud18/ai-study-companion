import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";
import { getProject } from "../services/projectService.js";
import "./Growth.css";

export default function Growth() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadGrowth();
    }, [projectId]);

    const loadGrowth = async () => {
        try {
            setLoading(true);
            setError("");

            const [projectResponse, analyticsResponse] =
                await Promise.all([
                    getProject(projectId),
                    api.get(`/analytics/project?projectId=${projectId}`)
                ]);

            setProject(projectResponse);
            setAnalytics(analyticsResponse.data);
        } catch (err) {
            console.error("Failed to load growth:", err);

            setError(
                err?.response?.data?.message ||
                "Failed to load growth data."
            );
        } finally {
            setLoading(false);
        }
    };

    const go = (path) => {
        navigate(`/project/${projectId}/${path}`);
    };

    const concepts = analytics?.concepts || [];

    const mastery = Math.round(
        (analytics?.overallMastery ?? 0) * 100
    );

    const completedQuizzes =
        analytics?.completedQuizzes ?? 0;

    const totalQuizzes =
        analytics?.totalQuizzes ?? 0;

    const assessments =
        analytics?.totalAssessments ?? 0;

    const tutorInteractions =
        analytics?.totalTutorInteractions ?? 0;

    const learningEvents =
        analytics?.totalLearningEvents ?? 0;

    if (loading) {
        return (
            <div className="growth-page">
                <div className="growth-loading">
                    Loading growth...
                </div>
            </div>
        );
    }

    return (
        <div className="growth-page">

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

                    <button
                        className="project-nav-item"
                        onClick={() => go("mastery")}
                    >
                        <span>◉</span>
                        Mastery
                    </button>

                    <button className="project-nav-item active">
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

            <main className="growth-main">

                <header className="growth-topbar">

                    <div className="breadcrumbs">
                        <span>Projects</span>
                        <span>/</span>

                        <strong>
                            {project?.name || "Project"}
                        </strong>

                        <span>/</span>

                        <strong>Growth</strong>
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

                <section className="growth-content">

                    {/* HEADER */}

                    <div className="growth-heading">

                        <span className="growth-eyebrow">
                            LEARNING PROGRESS
                        </span>

                        <h1>
                            Your learning journey
                        </h1>

                        <p>
                            See your learning activity and how your
                            progress is developing across this project.
                        </p>

                    </div>

                    {error && (
                        <div className="growth-error">
                            {error}
                        </div>
                    )}

                    {/* ================= STATS ================= */}

                    <section className="growth-stats">

                        <div className="growth-stat-card primary">

                            <span className="stat-icon">
                                ◉
                            </span>

                            <span className="stat-label">
                                OVERALL MASTERY
                            </span>

                            <strong>
                                {mastery}%
                            </strong>

                            <span className="stat-description">
                                Current concept mastery
                            </span>

                        </div>

                        <div className="growth-stat-card">

                            <span className="stat-icon">
                                ↗
                            </span>

                            <span className="stat-label">
                                LEARNING EVENTS
                            </span>

                            <strong>
                                {learningEvents}
                            </strong>

                            <span className="stat-description">
                                Recorded learning activities
                            </span>

                        </div>

                        <div className="growth-stat-card">

                            <span className="stat-icon">
                                ✦
                            </span>

                            <span className="stat-label">
                                TUTOR INTERACTIONS
                            </span>

                            <strong>
                                {tutorInteractions}
                            </strong>

                            <span className="stat-description">
                                Questions asked to AI Tutor
                            </span>

                        </div>

                        <div className="growth-stat-card">

                            <span className="stat-icon">
                                ✓
                            </span>

                            <span className="stat-label">
                                QUIZZES COMPLETED
                            </span>

                            <strong>
                                {completedQuizzes}
                                <small>
                                    / {totalQuizzes}
                                </small>
                            </strong>

                            <span className="stat-description">
                                Practice quizzes completed
                            </span>

                        </div>

                    </section>

                    {/* ================= ACTIVITY ================= */}

                    <section className="growth-section">

                        <div className="section-heading">

                            <div>
                                <span className="section-eyebrow">
                                    LEARNING ACTIVITY
                                </span>

                                <h2>
                                    How you're learning
                                </h2>

                                <p>
                                    A summary of the activities recorded
                                    for this project.
                                </p>
                            </div>

                        </div>

                        <div className="activity-grid">

                            <div className="activity-card">

                                <div className="activity-icon purple">
                                    ✦
                                </div>

                                <div>
                                    <strong>
                                        {tutorInteractions}
                                    </strong>

                                    <span>
                                        Tutor interactions
                                    </span>
                                </div>

                            </div>

                            <div className="activity-card">

                                <div className="activity-icon green">
                                    ✓
                                </div>

                                <div>
                                    <strong>
                                        {completedQuizzes}
                                    </strong>

                                    <span>
                                        Completed quizzes
                                    </span>
                                </div>

                            </div>

                            <div className="activity-card">

                                <div className="activity-icon orange">
                                    ✎
                                </div>

                                <div>
                                    <strong>
                                        {assessments}
                                    </strong>

                                    <span>
                                        Assessments completed
                                    </span>
                                </div>

                            </div>

                            <div className="activity-card">

                                <div className="activity-icon blue">
                                    ↗
                                </div>

                                <div>
                                    <strong>
                                        {learningEvents}
                                    </strong>

                                    <span>
                                        Total learning events
                                    </span>
                                </div>

                            </div>

                        </div>

                    </section>

                    {/* ================= CONCEPT PROGRESS ================= */}

                    <section className="growth-section">

                        <div className="section-heading">

                            <div>
                                <span className="section-eyebrow">
                                    CONCEPT PROGRESS
                                </span>

                                <h2>
                                    Where you're progressing
                                </h2>

                                <p>
                                    Your current mastery across the
                                    concepts you've studied.
                                </p>
                            </div>

                            <button
                                className="section-link"
                                onClick={() => go("mastery")}
                            >
                                View mastery →
                            </button>

                        </div>

                        <div className="concept-progress-list">

                            {concepts.map((concept) => {

                                const score = Math.round(
                                    (concept.masteryScore ?? 0) * 100
                                );

                                return (
                                    <div
                                        className="growth-concept"
                                        key={concept.conceptId}
                                    >

                                        <div className="concept-name">
                                            <span>
                                                {concept.conceptName}
                                            </span>

                                            <strong>
                                                {score}%
                                            </strong>
                                        </div>

                                        <div className="growth-progress">
                                            <div
                                                style={{
                                                    width:
                                                        `${score}%`
                                                }}
                                            />
                                        </div>

                                    </div>
                                );
                            })}

                        </div>

                    </section>

                    {/* ================= NEXT ACTION ================= */}

                    <section className="growth-next">

                        <div>

                            <span className="section-eyebrow">
                                KEEP GOING
                            </span>

                            <h2>
                                Turn activity into progress
                            </h2>

                            <p>
                                Use the AI Tutor to explore difficult
                                concepts and take quizzes to reinforce
                                what you've learned.
                            </p>

                        </div>

                        <div className="growth-actions">

                            <button
                                className="secondary-action"
                                onClick={() => go("tutor")}
                            >
                                Ask AI Tutor
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