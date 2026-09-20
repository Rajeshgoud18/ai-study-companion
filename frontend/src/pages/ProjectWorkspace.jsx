import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getProject } from "../services/projectService.js";
import { getMaterials } from "../services/materialService.js";
import api from "../services/api.js";

import "./ProjectWorkspace.css";

function ProjectWorkspace() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [growth, setGrowth] = useState(null);
    const [analytics, setAnalytics] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const userName =
        localStorage.getItem("name") || "Learner";

    /* =====================================================
       LOAD PROJECT OVERVIEW DATA
    ===================================================== */

    useEffect(() => {
        const loadOverview = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    projectResponse,
                    materialsResponse,
                    growthResponse,
                    analyticsResponse
                ] = await Promise.all([
                    getProject(projectId),
                    getMaterials(projectId),
                    api.get(
                        `/ai/growth?projectId=${projectId}`
                    ),
                    api.get(
                        `/analytics/project?projectId=${projectId}`
                    )
                ]);

                setProject(projectResponse);
                setMaterials(materialsResponse);
                setGrowth(growthResponse.data);
                setAnalytics(analyticsResponse.data);

            } catch (err) {
                console.error(
                    "Failed to load project overview:",
                    err
                );

                setError(
                    "Unable to load project overview."
                );
            } finally {
                setLoading(false);
            }
        };

        loadOverview();
    }, [projectId]);

    /* =====================================================
       GLOBAL NAVIGATION
    ===================================================== */

    const goHome = () => {
        navigate("/home");
    };

    const goSpaces = () => {
        navigate("/spaces");
    };

    const goProjects = () => {
        navigate("/projects");
    };

    const goAnalytics = () => {
        navigate("/analytics");
    };

    /* =====================================================
       PROJECT NAVIGATION
    ===================================================== */

    const openOverview = () => {
        navigate(`/project/${projectId}`);
    };

    const openMaterials = () => {
        navigate(`/project/${projectId}/materials`);
    };

    const openKnowledge = () => {
        navigate(`/project/${projectId}/knowledge`);
    };

    const openTutor = () => {
        navigate(`/project/${projectId}/tutor`);
    };

    const openQuiz = () => {
        navigate(`/project/${projectId}/quiz`);
    };

    const openAssessment = () => {
        navigate(`/project/${projectId}/assessment`);
    };

    const openMastery = () => {
        navigate(`/project/${projectId}/mastery`);
    };

    const openGrowth = () => {
        navigate(`/project/${projectId}/growth`);
    };

    const openProjectAnalytics = () => {
        navigate(`/project/${projectId}/analytics`);
    };

    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
        return (
            <div className="workspace-loading-page">
                <div className="workspace-loader">
                    <div className="loading-spinner"></div>

                    <h2>
                        Loading project...
                    </h2>

                    <p>
                        Preparing your project overview
                    </p>
                </div>
            </div>
        );
    }

    /* =====================================================
       ERROR
    ===================================================== */

    if (error || !project) {
        return (
            <div className="workspace-loading-page">
                <div className="workspace-loader">

                    <div className="error-icon">
                        !
                    </div>

                    <h2>
                        {error
                            ? "Something went wrong"
                            : "Project not found"}
                    </h2>

                    <p>
                        {error ||
                            "The requested project could not be found."}
                    </p>

                    <button
                        className="primary-action"
                        onClick={goProjects}
                    >
                        Back to Projects
                    </button>

                </div>
            </div>
        );
    }

    /* =====================================================
       OVERVIEW DATA
    ===================================================== */

    const masteryPercentage =
        Math.round(
            (growth?.overallMastery ?? 0) * 100
        );

    const conceptsCount =
        growth?.concepts?.length ?? 0;

    const materialCount =
        materials.length;

    const completedQuizzes =
        analytics?.completedQuizzes ?? 0;

    const totalQuizzes =
        analytics?.totalQuizzes ?? 0;

    const totalLearningEvents =
        analytics?.totalLearningEvents ?? 0;

    const quizProgress =
        totalQuizzes > 0
            ? `${completedQuizzes}/${totalQuizzes}`
            : "0";

    const readyMaterials =
        materials.filter(
            (material) =>
                material.status === "READY"
        ).length;

    return (
        <div className="workspace-app">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="workspace-sidebar">

                {/* BRAND */}

                <div
                    className="workspace-brand"
                    onClick={goHome}
                >
                    <div className="workspace-brand-icon">
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

                {/* GLOBAL NAVIGATION */}

                <div className="sidebar-section-label">
                    WORKSPACE
                </div>

                <nav className="workspace-main-nav">

                    <button
                        className="workspace-nav-item"
                        onClick={goHome}
                    >
                        <span>⌂</span>
                        Home
                    </button>

                    <button
                        className="workspace-nav-item"
                        onClick={goSpaces}
                    >
                        <span>□</span>
                        Spaces
                    </button>

                    <button
                        className="workspace-nav-item"
                        onClick={goProjects}
                    >
                        <span>◫</span>
                        Projects
                    </button>

                    <button
                        className="workspace-nav-item"
                        onClick={goAnalytics}
                    >
                        <span>⌁</span>
                        Analytics
                    </button>

                </nav>

                {/* CURRENT PROJECT */}

                <div className="sidebar-project-label">
                    CURRENT PROJECT
                </div>

                <div className="sidebar-project-card">

                    <div className="sidebar-project-icon">
                        ✦
                    </div>

                    <div>
                        <strong>
                            {project.name}
                        </strong>

                        <span>
                            {project.description ||
                                "Learning project"}
                        </span>
                    </div>

                </div>

                {/* PROJECT NAVIGATION */}

                <nav className="project-nav">

                    <button
                        className="project-nav-item active"
                        onClick={openOverview}
                    >
                        <span>⌂</span>
                        Overview
                    </button>

                    <button
                        className="project-nav-item"
                        onClick={openMaterials}
                    >
                        <span>▤</span>
                        Materials
                    </button>

                    <button
                        className="project-nav-item"
                        onClick={openKnowledge}
                    >
                        <span>◇</span>
                        Knowledge
                    </button>

                    <button
                        className="project-nav-item"
                        onClick={openTutor}
                    >
                        <span>✦</span>
                        AI Tutor
                    </button>

                    <button
                        className="project-nav-item"
                        onClick={openQuiz}
                    >
                        <span>✓</span>
                        Quiz
                    </button>

                    <button
                        className="project-nav-item"
                        onClick={openAssessment}
                    >
                        <span>◉</span>
                        Assessment
                    </button>

                    <button
                        className="project-nav-item"
                        onClick={openMastery}
                    >
                        <span>◉</span>
                        Mastery
                    </button>

                    <button
                        className="project-nav-item"
                        onClick={openGrowth}
                    >
                        <span>↗</span>
                        Growth
                    </button>

                    <button
                        className="project-nav-item"
                        onClick={openProjectAnalytics}
                    >
                        <span>⌁</span>
                        Analytics
                    </button>

                </nav>

                {/* SIDEBAR BOTTOM */}

                <div className="sidebar-bottom">

                    <button className="sidebar-bottom-item">
                        <span>?</span>
                        Help
                    </button>

                    <button className="sidebar-bottom-item">
                        <span>⚙</span>
                        Settings
                    </button>

                    <div className="sidebar-user">

                        <div className="sidebar-user-avatar">
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

                        <span className="sidebar-user-more">
                            ···
                        </span>

                    </div>

                </div>

            </aside>

            {/* =================================================
                MAIN
            ================================================= */}

            <main className="workspace-main">

                {/* TOP BAR */}

                <header className="workspace-topbar">

                    <div className="breadcrumb">

                        <button
                            onClick={goHome}
                            className="breadcrumb-button"
                        >
                            Home
                        </button>

                        <span>—</span>

                        <strong>
                            {project.name}
                        </strong>

                    </div>

                    <div className="topbar-actions">

                       

                        <div className="topbar-avatar">
                            {userName
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                    </div>

                </header>

                {/* CONTENT */}

                <div className="workspace-content">

                    {/* =================================================
                        PROJECT HEADER
                    ================================================= */}

                    <section className="project-overview">

                        <div>

                            <span className="workspace-eyebrow">
                                CURRENT PROJECT
                            </span>

                            <h1>
                                {project.name}
                            </h1>

                            <p>
                                {project.description ||
                                    "Learn, practice and grow with your AI Study Companion."}
                            </p>

                        </div>

                        <div className="overview-actions">

                            <button
                                className="secondary-action"
                                onClick={openMaterials}
                            >
                                View Materials
                            </button>

                            <button
                                className="primary-action"
                                onClick={openTutor}
                            >
                                ✦ Ask AI Tutor
                            </button>

                        </div>

                    </section>

                    {/* ERROR */}

                    {error && (
                        <div className="workspace-alert">
                            <span>!</span>
                            {error}
                        </div>
                    )}

                    {/* =================================================
                        SUMMARY
                    ================================================= */}

                    <section className="summary-grid">

                        <button
                            className="summary-card"
                            onClick={openMaterials}
                        >
                            <span>
                                Materials
                            </span>

                            <strong>
                                {materialCount}
                            </strong>

                            <small>
                                {readyMaterials} ready
                            </small>
                        </button>

                        <button
                            className="summary-card"
                            onClick={openKnowledge}
                        >
                            <span>
                                Concepts
                            </span>

                            <strong>
                                {conceptsCount}
                            </strong>

                            <small>
                                knowledge areas
                            </small>
                        </button>

                        <button
                            className="summary-card"
                            onClick={openMastery}
                        >
                            <span>
                                Overall Mastery
                            </span>

                            <strong>
                                {masteryPercentage}%
                            </strong>

                            <small>
                                {growth?.overallStatus ||
                                    "Learning in progress"}
                            </small>
                        </button>

                        <button
                            className="summary-card"
                            onClick={openQuiz}
                        >
                            <span>
                                Quiz Progress
                            </span>

                            <strong>
                                {quizProgress}
                            </strong>

                            <small>
                                completed quizzes
                            </small>
                        </button>

                    </section>

                    {/* =================================================
                        CONTINUE LEARNING
                    ================================================= */}

                    <section className="workspace-section">

                        <div className="section-heading">

                            <div>

                                <span className="section-eyebrow">
                                    PROJECT WORKSPACE
                                </span>

                                <h2>
                                    Continue learning
                                </h2>

                                <p>
                                    Everything you need to continue
                                    learning from this project.
                                </p>

                            </div>

                        </div>

                        <div className="overview-cards">

                            {/* MATERIALS */}

                            <article className="overview-card">

                                <div className="overview-card-icon">
                                    ▤
                                </div>

                                <div>

                                    <h3>
                                        Learning Materials
                                    </h3>

                                    <p>
                                        Manage the PDFs and learning
                                        resources used by this project.
                                    </p>

                                    <button
                                        className="text-action"
                                        onClick={openMaterials}
                                    >
                                        View Materials →
                                    </button>

                                </div>

                            </article>

                            {/* KNOWLEDGE */}

                            <article className="overview-card">

                                <div className="overview-card-icon">
                                    ◇
                                </div>

                                <div>

                                    <h3>
                                        Knowledge
                                    </h3>

                                    <p>
                                        Explore concepts identified from
                                        your project materials.
                                    </p>

                                    <button
                                        className="text-action"
                                        onClick={openKnowledge}
                                    >
                                        Explore Knowledge →
                                    </button>

                                </div>

                            </article>

                            {/* AI TUTOR */}

                            <article className="overview-card ai-card">

                                <div className="overview-card-icon">
                                    ✦
                                </div>

                                <div>

                                    <h3>
                                        AI Tutor
                                    </h3>

                                    <p>
                                        Ask questions and get answers
                                        grounded in your project materials.
                                    </p>

                                    <button
                                        className="text-action"
                                        onClick={openTutor}
                                    >
                                        Open AI Tutor →
                                    </button>

                                </div>

                            </article>

                            {/* PRACTICE */}

                            <article className="overview-card">

                                <div className="overview-card-icon">
                                    ✓
                                </div>

                                <div>

                                    <h3>
                                        Practice & Assessment
                                    </h3>

                                    <p>
                                        Test your understanding through
                                        quizzes and assessments.
                                    </p>

                                    <div className="card-actions">

                                        <button
                                            className="text-action"
                                            onClick={openQuiz}
                                        >
                                            Take Quiz →
                                        </button>

                                        <button
                                            className="text-action"
                                            onClick={openAssessment}
                                        >
                                            Assessment →
                                        </button>

                                    </div>

                                </div>

                            </article>

                        </div>

                    </section>

                    {/* =================================================
                        CURRENT PROGRESS
                    ================================================= */}

                    <section className="workspace-section">

                        <div className="section-heading">

                            <div>

                                <span className="section-eyebrow">
                                    LEARNING STATUS
                                </span>

                                <h2>
                                    Current progress
                                </h2>

                                <p>
                                    A quick view of your current learning
                                    state in this project.
                                </p>

                            </div>

                            <button
                                className="secondary-action"
                                onClick={openGrowth}
                            >
                                View Growth →
                            </button>

                        </div>

                        <div className="progress-grid">

                            <div className="progress-card mastery-card">

                                <div className="progress-card-content">

                                    <span>
                                        OVERALL MASTERY
                                    </span>

                                    <strong>
                                        {masteryPercentage}%
                                    </strong>

                                    <p>
                                        {growth?.overallStatus ||
                                            "Learning in progress"}
                                    </p>

                                </div>

                                <div
                                    className="mastery-circle"
                                    style={{
                                        "--progress":
                                            masteryPercentage
                                    }}
                                >
                                    <span>
                                        {masteryPercentage}%
                                    </span>
                                </div>

                            </div>

                            <div className="progress-card">

                                <span>
                                    LEARNING ACTIVITY
                                </span>

                                <strong>
                                    {totalLearningEvents}
                                </strong>

                                <p>
                                    recorded learning events
                                </p>

                                <button
                                    className="text-action"
                                    onClick={openProjectAnalytics}
                                >
                                    View Analytics →
                                </button>

                            </div>

                            <div className="progress-card">

                                <span>
                                    QUIZ PROGRESS
                                </span>

                                <strong>
                                    {completedQuizzes}
                                    <small>
                                        /{totalQuizzes}
                                    </small>
                                </strong>

                                <p>
                                    quizzes completed
                                </p>

                                <button
                                    className="text-action"
                                    onClick={openQuiz}
                                >
                                    Practice Now →
                                </button>

                            </div>

                        </div>

                    </section>

                    {/* =================================================
                        QUICK ACTIONS
                    ================================================= */}

                    <section className="workspace-section quick-section">

                        <div className="section-heading">

                            <div>

                                <span className="section-eyebrow">
                                    QUICK ACTIONS
                                </span>

                                <h2>
                                    Keep learning
                                </h2>

                            </div>

                        </div>

                        <div className="quick-actions">

                            <button
                                className="primary-action"
                                onClick={openTutor}
                            >
                                ✦ Ask AI Tutor
                            </button>

                            <button
                                className="secondary-action"
                                onClick={openQuiz}
                            >
                                ✓ Take Quiz
                            </button>

                            <button
                                className="secondary-action"
                                onClick={openMastery}
                            >
                                ◉ View Mastery
                            </button>

                            <button
                                className="secondary-action"
                                onClick={openProjectAnalytics}
                            >
                                ⌁ View Analytics
                            </button>

                        </div>

                    </section>

                    <footer className="workspace-footer">

                        <span>
                            AI Study Companion
                        </span>

                        <span>
                            {project.name}
                        </span>

                    </footer>

                </div>

            </main>

        </div>
    );
}

export default ProjectWorkspace;