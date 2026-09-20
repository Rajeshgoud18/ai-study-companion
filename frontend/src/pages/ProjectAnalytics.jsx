import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";
import { getProject } from "../services/projectService.js";
import "./ProjectAnalytics.css";

export default function ProjectAnalytics() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadAnalytics();
    }, [projectId]);

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            setError("");

            const [projectResponse, analyticsResponse] =
                await Promise.all([
                    getProject(projectId),
                    api.get(
                        `/analytics/project?projectId=${projectId}`
                    )
                ]);

            setProject(projectResponse);
            setAnalytics(analyticsResponse.data);

        } catch (err) {
            console.error(
                "Failed to load analytics:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load analytics."
            );
        } finally {
            setLoading(false);
        }
    };

    const go = (path) => {
        navigate(`/project/${projectId}/${path}`);
    };

    const totalQuizzes =
        analytics?.totalQuizzes ?? 0;

    const completedQuizzes =
        analytics?.completedQuizzes ?? 0;

    const quizCompletion =
        totalQuizzes > 0
            ? Math.round(
                (completedQuizzes / totalQuizzes) * 100
            )
            : 0;

    const mastery = Math.round(
        (analytics?.overallMastery ?? 0) * 100
    );

    const concepts =
        analytics?.concepts || [];

    if (loading) {
        return (
            <div className="project-analytics-page">
                <div className="analytics-loading">
                    Loading analytics...
                </div>
            </div>
        );
    }

    return (
        <div className="project-analytics-page">

            {/* ================= SIDEBAR ================= */}

            <aside className="sidebar">

                <div className="sidebar-brand">
                    <div className="brand-icon">
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

                    <button
                        className="project-nav-item"
                        onClick={() => go("growth")}
                    >
                        <span>↗</span>
                        Growth
                    </button>

                    <button className="project-nav-item active">
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

            <main className="analytics-main">

                <header className="analytics-topbar">

                    <div className="breadcrumbs">

                        <span>Projects</span>
                        <span>/</span>

                        <strong>
                            {project?.name || "Project"}
                        </strong>

                        <span>/</span>

                        <strong>
                            Analytics
                        </strong>

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

                <section className="analytics-content">

                    {/* HEADER */}

                    <div className="analytics-heading">

                        <span className="analytics-eyebrow">
                            PROJECT ANALYTICS
                        </span>

                        <h1>
                            Learning at a glance
                        </h1>

                        <p>
                            A measurable view of your activity,
                            practice and concept mastery.
                        </p>

                    </div>

                    {error && (
                        <div className="analytics-error">
                            {error}
                        </div>
                    )}

                    {/* ================= OVERVIEW ================= */}

                    <section className="analytics-overview">

                        <div className="overview-main">

                            <div className="overview-label">
                                OVERALL MASTERY
                            </div>

                            <div className="overview-value">
                                {mastery}%
                            </div>

                            <p>
                                Average mastery across the
                                concepts in this project.
                            </p>

                            <button
                                onClick={() => go("mastery")}
                            >
                                View mastery →
                            </button>

                        </div>

                        <div className="overview-side">

                            <Metric
                                label="Learning events"
                                value={
                                    analytics?.totalLearningEvents ?? 0
                                }
                            />

                            <Metric
                                label="Tutor interactions"
                                value={
                                    analytics?.totalTutorInteractions ?? 0
                                }
                            />

                            <Metric
                                label="Quizzes"
                                value={totalQuizzes}
                            />

                            <Metric
                                label="Assessments"
                                value={
                                    analytics?.totalAssessments ?? 0
                                }
                            />

                        </div>

                    </section>

                    {/* ================= ACTIVITY ================= */}

                    <section className="analytics-section">

                        <div className="section-heading">

                            <div>
                                <span className="section-eyebrow">
                                    ACTIVITY
                                </span>

                                <h2>
                                    Your learning activity
                                </h2>

                                <p>
                                    Recorded activity from your
                                    study sessions.
                                </p>
                            </div>

                        </div>

                        <div className="activity-cards">

                            <ActivityCard
                                icon="✦"
                                title="Tutor interactions"
                                value={
                                    analytics?.totalTutorInteractions ?? 0
                                }
                                description="Questions asked to the AI Tutor"
                            />

                            <ActivityCard
                                icon="✓"
                                title="Completed quizzes"
                                value={completedQuizzes}
                                description="Quizzes fully completed"
                            />

                            <ActivityCard
                                icon="✎"
                                title="Assessments"
                                value={
                                    analytics?.totalAssessments ?? 0
                                }
                                description="Answers evaluated by AI"
                            />

                            <ActivityCard
                                icon="↗"
                                title="Learning events"
                                value={
                                    analytics?.totalLearningEvents ?? 0
                                }
                                description="Total recorded activities"
                            />

                        </div>

                    </section>

                    {/* ================= QUIZ ANALYTICS ================= */}

                    <section className="analytics-section">

                        <div className="section-heading">

                            <div>
                                <span className="section-eyebrow">
                                    PRACTICE
                                </span>

                                <h2>
                                    Quiz completion
                                </h2>

                                <p>
                                    How many generated quizzes
                                    you've completed.
                                </p>
                            </div>

                            <button
                                className="section-link"
                                onClick={() => go("quiz")}
                            >
                                Take a quiz →
                            </button>

                        </div>

                        <div className="quiz-analytics">

                            <div className="quiz-count">

                                <strong>
                                    {completedQuizzes}
                                </strong>

                                <span>
                                    of {totalQuizzes} quizzes completed
                                </span>

                            </div>

                            <div className="quiz-progress-wrapper">

                                <div className="quiz-progress">

                                    <div
                                        style={{
                                            width:
                                                `${quizCompletion}%`
                                        }}
                                    />

                                </div>

                                <strong>
                                    {quizCompletion}%
                                </strong>

                            </div>

                        </div>

                    </section>

                    {/* ================= CONCEPT ANALYTICS ================= */}

                    <section className="analytics-section">

                        <div className="section-heading">

                            <div>
                                <span className="section-eyebrow">
                                    CONCEPTS
                                </span>

                                <h2>
                                    Concept performance
                                </h2>

                                <p>
                                    Current mastery score for each
                                    tracked concept.
                                </p>
                            </div>

                            <button
                                className="section-link"
                                onClick={() => go("knowledge")}
                            >
                                View knowledge →
                            </button>

                        </div>

                        <div className="concept-table">

                            <div className="concept-table-header">
                                <span>Concept</span>
                                <span>Mastery</span>
                            </div>

                            {concepts.length === 0 ? (

                                <div className="empty-concepts">
                                    No concept analytics available yet.
                                </div>

                            ) : (

                                concepts.map((concept) => {

                                    const score = Math.round(
                                        (concept.masteryScore ?? 0) * 100
                                    );

                                    return (
                                        <div
                                            className="concept-row"
                                            key={concept.conceptId}
                                        >

                                            <span className="concept-title">
                                                {concept.conceptName}
                                            </span>

                                            <div className="concept-score">

                                                <div className="analytics-progress">
                                                    <div
                                                        style={{
                                                            width:
                                                                `${score}%`
                                                        }}
                                                    />
                                                </div>

                                                <strong>
                                                    {score}%
                                                </strong>

                                            </div>

                                        </div>
                                    );
                                })

                            )}

                        </div>

                    </section>

                </section>

            </main>

        </div>
    );
}


/* ================= COMPONENTS ================= */

function Metric({ label, value }) {
    return (
        <div className="metric">

            <span>
                {label}
            </span>

            <strong>
                {value}
            </strong>

        </div>
    );
}


function ActivityCard({
    icon,
    title,
    value,
    description
}) {
    return (
        <div className="activity-card">

            <div className="activity-icon">
                {icon}
            </div>

            <div>
                <span>
                    {title}
                </span>

                <strong>
                    {value}
                </strong>

                <small>
                    {description}
                </small>
            </div>

        </div>
    );
}