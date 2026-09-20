import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

import api from "../services/api.js";
import { getProjectAnalytics } from "../services/analyticsService.js";
import { getUserSpaces } from "../services/spaceService.js";
import { getProjects } from "../services/projectService.js";

import "./Home.css";

function Home() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [spaces, setSpaces] = useState([]);
    const [selectedSpace, setSelectedSpace] = useState(null);

    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);

    const [analytics, setAnalytics] = useState(null);
    const [growth, setGrowth] = useState(null);

    const [loading, setLoading] = useState(true);
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);

    const [error, setError] = useState("");
    const [showCreateSpace, setShowCreateSpace] = useState(false);
    const [spaceName, setSpaceName] = useState("");
    const [spaceDescription, setSpaceDescription] = useState("");
    const [creatingSpace, setCreatingSpace] = useState(false);
    const [spaceCreateError, setSpaceCreateError] = useState("");

    // ================================
    // LOAD SPACES
    // ================================

    useEffect(() => {
        const loadSpaces = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getUserSpaces();

                setSpaces(data);

                if (data.length > 0) {
                    setSelectedSpace(data[0]);
                }
            } catch (error) {
                console.error("Failed to load spaces:", error);
                setError("Unable to load your spaces.");
            } finally {
                setLoading(false);
            }
        };

        if (user?.userId) {
            loadSpaces();
        }
    }, [user]);

    // ================================
    // LOAD PROJECTS
    // ================================

    useEffect(() => {
        const loadProjects = async () => {
            if (!selectedSpace) {
                return;
            }

            try {
                setProjectsLoading(true);
                setError("");

                const data = await getProjects(selectedSpace.id);

                setProjects(data);

                if (data.length > 0) {
                    setSelectedProject(data[0]);
                } else {
                    setSelectedProject(null);
                    setAnalytics(null);
                }
            } catch (error) {
                console.error("Failed to load projects:", error);

                setError("Unable to load projects.");
                setProjects([]);
                setSelectedProject(null);
                setAnalytics(null);
            } finally {
                setProjectsLoading(false);
            }
        };

        loadProjects();
    }, [selectedSpace]);

    // ================================
    // LOAD ANALYTICS
    // ================================

    useEffect(() => {
        const loadAnalytics = async () => {
            if (!user?.userId || !selectedProject?.id) {
                return;
            }

            try {
                setAnalyticsLoading(true);
                setError("");

                const data = await getProjectAnalytics(
                    user.userId,
                    selectedProject.id
                );

                setAnalytics(data);
            } catch (error) {
                console.error("Failed to load analytics:", error);

                setError("Unable to load project analytics.");
                setAnalytics(null);
            } finally {
                setAnalyticsLoading(false);
            }
        };

        loadAnalytics();
    }, [user, selectedProject]);

    useEffect(() => {
        const loadGrowth = async () => {
            if (!selectedProject?.id) {
                return;
            }

            try {
                const response = await api.get(
                    `/ai/growth?projectId=${selectedProject.id}`
                );

                setGrowth(response.data);

            } catch (error) {
                console.error(
                    "Failed to load growth:",
                    error
                );

                setGrowth(null);
            }
        };

        loadGrowth();
    }, [selectedProject]);


    // ================================
    // HANDLERS
    // ================================

    const handleSpaceSelect = (space) => {
        setSelectedSpace(space);
        setProjects([]);
        setSelectedProject(null);
        setAnalytics(null);
        setError("");
    };

    const handleProjectSelect = (project) => {
        setSelectedProject(project);
        setAnalytics(null);
        setError("");
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleCreateSpace = async (event) => {
        event.preventDefault();

        if (!spaceName.trim()) {
            setSpaceCreateError("Space name is required.");
            return;
        }

        try {
            setCreatingSpace(true);
            setSpaceCreateError("");

            const response = await api.post("/spaces", {
                name: spaceName.trim(),
                description: spaceDescription.trim()
            });

            const createdSpace = response.data;

            // Add the newly created space to the existing list
            setSpaces((currentSpaces) => [
                ...currentSpaces,
                createdSpace
            ]);

            // Select the newly created space
            setSelectedSpace(createdSpace);

            // Clear form
            setSpaceName("");
            setSpaceDescription("");

            // Close modal
            setShowCreateSpace(false);

        } catch (error) {
            console.error("Failed to create space:", error);

            console.error("Response:", error?.response?.data);

            setSpaceCreateError(
                error?.response?.data?.message ||
                "Unable to create space."
            );

        } finally {
            setCreatingSpace(false);
        }
    };

    const openProject = () => {
        if (selectedProject?.id) {
            navigate(`/project/${selectedProject.id}`);
        }
    };

    const openTutor = () => {
        if (selectedProject?.id) {
            navigate(`/project/${selectedProject.id}/tutor`);
        }
    };

    const openMaterials = () => {
        if (selectedProject?.id) {
            navigate(`/project/${selectedProject.id}/materials`);
        }
    };

    const openKnowledge = () => {
        if (selectedProject?.id) {
            navigate(`/project/${selectedProject.id}/knowledge`);
        }
    };



    const openQuiz = () => {
        if (selectedProject?.id) {
            navigate(`/project/${selectedProject.id}/quiz`);
        }
    };

    const openAssessment = () => {
        if (selectedProject?.id) {
            navigate(`/project/${selectedProject.id}/assessment`);
        }
    };

    const openMastery = () => {
        if (selectedProject?.id) {
            navigate(`/project/${selectedProject.id}/mastery`);
        }
    };

    const openGrowth = () => {
        if (selectedProject?.id) {
            navigate(`/project/${selectedProject.id}/growth`);
        }
    };

    const openProjectAnalytics = () => {
        if (selectedProject?.id) {
            navigate(`/project/${selectedProject.id}/analytics`);
        }
    };

    // ================================
    // LOADING
    // ================================

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>

                <h2>Preparing your learning space...</h2>

                <p>
                    Loading your spaces and projects
                </p>
            </div>
        );
    }

    const mastery = Math.round(
        (growth?.overallMastery ?? 0) * 100
    );

    const concepts = analytics?.concepts ?? [];

    const completedQuizzes =
        analytics?.completedQuizzes ?? 0;

    const tutorInteractions =
        analytics?.totalTutorInteractions ?? 0;

    const assessments =
        analytics?.totalAssessments ?? 0;

    return (
        <div className="dashboard-page">

            {/* =====================================
                SIDEBAR
            ===================================== */}

            <aside className="dashboard-sidebar">

                <div className="sidebar-brand">

                    <div className="sidebar-brand-icon">
                        ✦
                    </div>

                    <div>
                        <div className="sidebar-brand-name">
                            AI Study Companion
                        </div>

                        <div className="sidebar-brand-subtitle">
                            Learn smarter
                        </div>
                    </div>

                </div>

                {/* Main Navigation */}

                <div className="sidebar-section">

                    <div className="sidebar-section-label">
                        WORKSPACE
                    </div>

                    <button className="sidebar-item active">
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


                </div>

                {/* Current Project */}

                {selectedProject && (
                    <div className="sidebar-project">

                        <div className="sidebar-section-label">
                            CURRENT PROJECT
                        </div>

                        <div className="current-project-box">

                            <div className="current-project-icon">
                                ◈
                            </div>

                            <div className="current-project-info">

                                <strong>
                                    {selectedProject.name}
                                </strong>

                                <span>
                                    {selectedProject.description ||
                                        "Active learning project"}
                                </span>

                            </div>

                            <span className="current-project-arrow">
                                ›
                            </span>

                        </div>

                        <div className="project-menu">


                            <button
                                className="project-menu-item"
                                onClick={openMaterials}
                            >
                                <span>▤</span>
                                Materials
                            </button>

                            <button
                                className="project-menu-item"
                                onClick={openKnowledge}
                            >
                                <span>◇</span>
                                Knowledge
                            </button>

                            <button
                                className="project-menu-item"
                                onClick={openTutor}
                            >
                                <span>✦</span>
                                AI Tutor
                            </button>

                            <button
                                className="project-menu-item"
                                onClick={openQuiz}
                            >
                                <span>✓</span>
                                Quiz
                            </button>

                            <button
                                className="project-menu-item"
                                onClick={openAssessment}
                            >
                                <span>◈</span>
                                Assessment
                            </button>

                            <button
                                className="project-menu-item"
                                onClick={openMastery}
                            >
                                <span>◉</span>
                                Mastery
                            </button>

                            <button
                                className="project-menu-item"
                                onClick={openGrowth}
                            >
                                <span>↗</span>
                                Growth
                            </button>

                            <button
                                className="project-menu-item"
                                onClick={openProjectAnalytics}
                            >
                                <span>⌁</span>
                                Analytics
                            </button>

                        </div>

                    </div>
                )}

                {/* Sidebar Bottom */}

                <div className="sidebar-bottom">

                    <div className="sidebar-user">

                        <div className="sidebar-user-avatar">
                            {user?.name
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}
                        </div>

                        <div className="sidebar-user-info">
                            <strong>
                                {user?.name}
                            </strong>

                            <span>
                                Learner
                            </span>
                        </div>

                        <button
                            className="sidebar-user-menu"
                            onClick={handleLogout}
                        >
                            ⋯
                        </button>

                    </div>

                </div>

            </aside>

            {/* =====================================
                MAIN
            ===================================== */}

            <main className="dashboard-main">

                {/* TOPBAR */}

                <header className="dashboard-topbar">

                    <div className="breadcrumb">
                        Home
                        <span>—</span>
                        Dashboard
                    </div>

                    <div className="topbar-actions">
                        <div className="topbar-avatar">
                            {user?.name
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}
                        </div>

                    </div>

                </header>

                <div className="dashboard-content">

                    {/* ERROR */}

                    {error && (
                        <div className="dashboard-alert">
                            <span>!</span>
                            {error}
                        </div>
                    )}

                    {/* =====================================
                        PAGE HEADER
                    ===================================== */}

                    <section className="page-header">

                        <div>

                            <h1>
                                Good morning,{" "}
                                {user?.name}
                            </h1>

                            <p>
                                Here's where you left off —
                                and what's worth doing next.
                            </p>

                        </div>

                        <div className="page-actions">

                            <button
                                className="secondary-button"
                                onClick={() => {
                                    setSpaceName("");
                                    setSpaceDescription("");
                                    setSpaceCreateError("");
                                    setShowCreateSpace(true);
                                }}
                            >
                                + New Space
                            </button>

                            <button
                                className="primary-button"
                                onClick={openTutor}
                                disabled={!selectedProject}
                            >
                                ✦ Ask AI Tutor
                            </button>

                        </div>

                    </section>

                    {/* =====================================
                        CONTINUE LEARNING
                    ===================================== */}

                    <section className="continue-card">

                        <div className="continue-card-content">

                            <div className="continue-eyebrow">
                                ✦ CONTINUE LEARNING
                            </div>

                            {selectedProject ? (
                                <>
                                    <h2>
                                        {selectedProject.name}
                                    </h2>

                                    <div className="continue-meta">

                                        <span>
                                            Current concept
                                        </span>

                                        <strong>
                                            {concepts[0]
                                                ?.conceptName ||
                                                "Continue learning"}
                                        </strong>

                                    </div>

                                    <div className="continue-progress-row">

                                        <div className="continue-progress">

                                            <div
                                                style={{
                                                    width:
                                                        `${mastery}%`
                                                }}
                                            />

                                        </div>

                                        <span>
                                            {mastery}% complete
                                        </span>

                                    </div>

                                    <div className="continue-footer">

                                        <span>
                                            ◷ Last activity · AI
                                            Tutor session
                                        </span>

                                        <button
                                            className="continue-button"
                                            onClick={openTutor}
                                        >
                                            Continue →
                                        </button>

                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2>
                                        Start your first project
                                    </h2>

                                    <p>
                                        Select a project to continue
                                        learning.
                                    </p>
                                </>
                            )}

                        </div>

                    </section>

                    {/* =====================================
                        KPI CARDS
                    ===================================== */}

                    <section className="stats-row">

                        <div className="dashboard-stat">

                            <div className="stat-top">
                                <span>
                                    Active Projects
                                </span>

                                <span className="stat-symbol">
                                    ◫
                                </span>
                            </div>

                            <strong>
                                {projects.length}
                            </strong>

                            <small>
                                +1 this month
                            </small>

                        </div>

                        <div className="dashboard-stat">

                            <div className="stat-top">
                                <span>
                                    Tutor Sessions
                                </span>

                                <span className="stat-symbol">
                                    ◷
                                </span>
                            </div>

                            <strong>
                                {tutorInteractions}
                            </strong>

                            <small>
                                AI learning interactions
                            </small>

                        </div>

                        <div className="dashboard-stat">

                            <div className="stat-top">
                                <span>
                                    Overall Mastery
                                </span>

                                <span className="stat-symbol">
                                    ◉
                                </span>
                            </div>

                            <strong>
                                {mastery}%
                            </strong>

                            <small className="positive">
                                +6% this week
                            </small>

                        </div>

                        <div className="dashboard-stat">

                            <div className="stat-top">
                                <span>
                                    Quiz Completion
                                </span>

                                <span className="stat-symbol">
                                    ◉
                                </span>
                            </div>

                            <strong>
                                {completedQuizzes}
                            </strong>

                            <small>
                                completed quizzes
                            </small>

                        </div>

                    </section>

                    {/* =====================================
                        RECOMMENDATION + ATTENTION
                    ===================================== */}

                    <section className="insight-grid">

                        <div className="recommendation-card">

                            <div className="recommendation-icon">
                                !
                            </div>

                            <div className="recommendation-content">

                                <span>
                                    RECOMMENDED NEXT ACTION
                                </span>

                                <p>
                                    Your understanding is
                                    improving. Keep practicing
                                    the concepts that need more
                                    attention.
                                </p>

                            </div>

                            <button
                                onClick={openProject}
                            >
                                Practice this concept →
                            </button>

                        </div>

                        <div className="attention-card">

                            <div className="panel-title">
                                <div>
                                    <span>
                                        FOCUS AREAS
                                    </span>
                                    <h3>
                                        Areas requiring attention
                                    </h3>
                                </div>

                                <button>
                                    View all
                                </button>
                            </div>

                            <div className="attention-list">

                                {concepts.length > 0 ? (
                                    concepts
                                        .slice(0, 3)
                                        .map((concept) => {

                                            const percentage =
                                                Math.round(
                                                    (concept.masteryScore ??
                                                        0) * 100
                                                );

                                            return (
                                                <div
                                                    className="attention-item"
                                                    key={
                                                        concept.conceptId
                                                    }
                                                >

                                                    <div className="attention-item-top">

                                                        <strong>
                                                            {
                                                                concept.conceptName
                                                            }
                                                        </strong>

                                                        <span>
                                                            {percentage}%
                                                        </span>

                                                    </div>

                                                    <div className="attention-progress">

                                                        <div
                                                            style={{
                                                                width:
                                                                    `${percentage}%`
                                                            }}
                                                        />

                                                    </div>

                                                </div>
                                            );
                                        })
                                ) : (
                                    <div className="no-data">
                                        No concept data yet.
                                    </div>
                                )}

                            </div>

                        </div>

                    </section>

                    {/* =====================================
                        RECENT PROJECTS
                    ===================================== */}

                    <section
                        id="projects"
                        className="dashboard-section"
                    >

                        <div className="section-title-row">

                            <div>
                                <span>
                                    WORKSPACE
                                </span>

                                <h2>
                                    Recent projects
                                </h2>
                            </div>

                            <button>
                                View all →
                            </button>

                        </div>

                        <div className="recent-projects">

                            {projects.slice(0, 3).map(
                                (project) => {

                                    const isSelected =
                                        selectedProject?.id ===
                                        project.id;

                                    return (
                                        <button
                                            key={project.id}
                                            className={
                                                isSelected
                                                    ? "recent-project active"
                                                    : "recent-project"
                                            }
                                            onClick={() =>
                                                handleProjectSelect(
                                                    project
                                                )
                                            }
                                        >

                                            <div className="recent-project-icon">
                                                ◈
                                            </div>

                                            <div className="recent-project-body">

                                                <strong>
                                                    {project.name}
                                                </strong>

                                                <span>
                                                    {project.description ||
                                                        "Learning project"}
                                                </span>

                                                <div className="recent-project-bottom">

                                                    <div className="mini-progress">
                                                        <div
                                                            style={{
                                                                width:
                                                                    `${mastery}%`
                                                            }}
                                                        />
                                                    </div>

                                                    <small>
                                                        {mastery}% complete
                                                    </small>

                                                </div>

                                            </div>

                                            <span className="project-arrow">
                                                →
                                            </span>

                                        </button>
                                    );
                                }
                            )}

                            {projects.length === 0 && (
                                <div className="empty-projects">
                                    No projects available yet.
                                </div>
                            )}

                        </div>

                    </section>

                    {/* =====================================
                        SPACES
                    ===================================== */}

                    <section
                        id="spaces"
                        className="dashboard-section"
                    >

                        <div className="section-title-row">

                            <div>
                                <span>
                                    ORGANIZE
                                </span>

                                <h2>
                                    Your spaces
                                </h2>
                            </div>

                            <span className="count-label">
                                {spaces.length}{" "}
                                {spaces.length === 1
                                    ? "space"
                                    : "spaces"}
                            </span>

                        </div>

                        <div className="spaces-row">

                            {spaces.map((space) => (

                                <button
                                    key={space.id}
                                    className={
                                        selectedSpace?.id ===
                                            space.id
                                            ? "space-item active"
                                            : "space-item"
                                    }
                                    onClick={() =>
                                        handleSpaceSelect(space)
                                    }
                                >

                                    <div className="space-item-icon">
                                        {space.name
                                            ?.charAt(0)
                                            ?.toUpperCase() || "S"}
                                    </div>

                                    <div>
                                        <strong>
                                            {space.name}
                                        </strong>

                                        <span>
                                            View projects →
                                        </span>
                                    </div>

                                </button>

                            ))}

                        </div>

                    </section>

                    {/* =====================================
                        RECENT ACTIVITY
                    ===================================== */}

                    <section
                        id="progress"
                        className="dashboard-section"
                    >

                        <div className="section-title-row">

                            <div>
                                <span>
                                    ACTIVITY
                                </span>

                                <h2>
                                    Recent activity
                                </h2>
                            </div>

                            <button>
                                View analytics →
                            </button>

                        </div>

                        <div className="activity-list">

                            <div className="activity-row">

                                <div className="activity-dot green">
                                    ✓
                                </div>

                                <div>
                                    <strong>
                                        Quiz completed
                                    </strong>

                                    <span>
                                        {completedQuizzes} quizzes
                                        completed
                                    </span>
                                </div>

                                <time>
                                    Recently
                                </time>

                            </div>

                            <div className="activity-row">

                                <div className="activity-dot purple">
                                    ✦
                                </div>

                                <div>
                                    <strong>
                                        AI Tutor interaction
                                    </strong>

                                    <span>
                                        {tutorInteractions} tutor
                                        interactions
                                    </span>
                                </div>

                                <time>
                                    Recently
                                </time>

                            </div>

                            <div className="activity-row">

                                <div className="activity-dot blue">
                                    ◈
                                </div>

                                <div>
                                    <strong>
                                        Learning activity
                                    </strong>

                                    <span>
                                        {analytics?.totalLearningEvents ??
                                            0}{" "}
                                        learning events
                                    </span>
                                </div>

                                <time>
                                    Recently
                                </time>

                            </div>

                        </div>

                    </section>

                </div>

                <footer className="dashboard-footer">
                    <span>AI Study Companion</span>
                    <span>Learn · Practice · Grow</span>
                </footer>

            </main>
            {showCreateSpace && (
                <div
                    className="space-modal-overlay"
                    onClick={() => setShowCreateSpace(false)}
                >
                    <div
                        className="space-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            className="space-modal-close"
                            onClick={() => setShowCreateSpace(false)}
                            type="button"
                        >
                            ×
                        </button>

                        <div className="space-modal-icon">
                            ✦
                        </div>

                        <div className="space-modal-header">
                            <h2>Create a new space</h2>

                            <p>
                                Organize your learning around a topic,
                                skill, or goal.
                            </p>
                        </div>

                        {spaceCreateError && (
                            <div className="space-modal-error">
                                {spaceCreateError}
                            </div>
                        )}

                        <form onSubmit={handleCreateSpace}>

                            <div className="space-form-group">
                                <label htmlFor="space-name">
                                    Space name
                                </label>

                                <input
                                    id="space-name"
                                    type="text"
                                    value={spaceName}
                                    onChange={(event) =>
                                        setSpaceName(event.target.value)
                                    }
                                    placeholder="e.g. Java Backend Development"
                                    autoFocus
                                />
                            </div>

                            <div className="space-form-group">
                                <label htmlFor="space-description">
                                    Description
                                    <span>Optional</span>
                                </label>

                                <textarea
                                    id="space-description"
                                    value={spaceDescription}
                                    onChange={(event) =>
                                        setSpaceDescription(
                                            event.target.value
                                        )
                                    }
                                    placeholder="What do you want to learn?"
                                    rows="4"
                                />
                            </div>

                            <div className="space-modal-actions">

                                <button
                                    type="button"
                                    className="space-cancel-button"
                                    onClick={() =>
                                        setShowCreateSpace(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="space-create-button"
                                    disabled={creatingSpace}
                                >
                                    {creatingSpace
                                        ? "Creating..."
                                        : "Create Space →"}
                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Home;