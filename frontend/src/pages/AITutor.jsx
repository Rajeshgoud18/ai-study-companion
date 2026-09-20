import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import { getProject } from "../services/projectService.js";
import { getMaterials } from "../services/materialService.js";
import { askTutor } from "../services/tutorService.js";
import api from "../services/api.js";

import "./AITutor.css";
import "./AITutor.css";

function AITutor() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [growth, setGrowth] = useState(null);

    const [question, setQuestion] = useState("");

    const [messages, setMessages] = useState([]);

    const [loading, setLoading] = useState(true);
    const [tutorLoading, setTutorLoading] = useState(false);
    const [error, setError] = useState("");

    const [analytics, setAnalytics] = useState(null);

    const userName =
        localStorage.getItem("name") || "Learner";

    // ==========================================
    // LOAD PROJECT
    // ==========================================

    useEffect(() => {
        const loadProject = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getProject(projectId);

                setProject(data);
            } catch (error) {
                console.error(
                    "Failed to load project:",
                    error
                );

                setError("Unable to load project.");
            } finally {
                setLoading(false);
            }
        };

        loadProject();
    }, [projectId]);

    // ==========================================
    // LOAD MATERIALS
    // ==========================================

    useEffect(() => {
        const loadMaterials = async () => {
            try {
                const data =
                    await getMaterials(projectId);

                setMaterials(data);
            } catch (error) {
                console.error(
                    "Failed to load materials:",
                    error
                );
            }
        };

        loadMaterials();
    }, [projectId]);

    // ==========================================
    // LOAD GROWTH
    // ==========================================

    useEffect(() => {
        const loadGrowth = async () => {
            try {
                const response = await api.get(
                    `/ai/growth?projectId=${projectId}`
                );

                setGrowth(response.data);
            } catch (error) {
                console.error(
                    "Failed to load growth:",
                    error
                );
            }
        };

        loadGrowth();
    }, [projectId]);

    // ==========================================
    // LOAD ANALYTICS
    // ==========================================

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const userId =
                    localStorage.getItem("userId");

                if (!userId) {
                    return;
                }

                const response = await api.get(
                    `/api/analytics/project?userId=${userId}&projectId=${projectId}`
                );

                setAnalytics(response.data);
            } catch (error) {
                console.error(
                    "Failed to load analytics:",
                    error
                );
            }
        };

        loadAnalytics();
    }, [projectId]);

    // ==========================================
    // ASK TUTOR
    // ==========================================

    const handleAskTutor = async () => {

        const trimmedQuestion = question.trim();

        if (!trimmedQuestion) {
            return;
        }

        try {

            setTutorLoading(true);
            setError("");

            // Clear the input immediately
            setQuestion("");

            // Add the user's question immediately
            setMessages((currentMessages) => [
                ...currentMessages,
                {
                    type: "user",
                    content: trimmedQuestion
                }
            ]);

            const response = await askTutor(
                projectId,
                trimmedQuestion
            );

            // Add AI response without deleting previous messages
            setMessages((currentMessages) => [
                ...currentMessages,
                {
                    type: "ai",
                    content: response.answer,
                    citations: response.citations || []
                }
            ]);

        } catch (error) {

            console.error(
                "Tutor request failed:",
                error
            );

            setError(
                "Unable to get an answer from the AI Tutor."
            );

        } finally {

            setTutorLoading(false);

        }
    };

    // ==========================================
    // ENTER KEY
    // ==========================================

    const handleKeyDown = (event) => {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();

            handleAskTutor();
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="tutor-loading-page">
                <div className="tutor-loading-spinner"></div>

                <h2>Preparing your AI Tutor...</h2>

                <p>
                    Loading your project and learning
                    materials
                </p>
            </div>
        );
    }

    // ==========================================
    // DATA
    // ==========================================

    const mastery = Math.round(
        (growth?.overallMastery ?? analytics?.overallMastery ?? 0) * 100
    );

    const concepts =
        analytics?.concepts ??
        growth?.concepts ??
        [];

    const attentionConcepts =
        concepts
            .filter(
                (concept) =>
                    Number(
                        concept.mastery ??
                        concept.masteryScore ??
                        0
                    ) < 0.7
            )
            .slice(0, 3);

    const recommendedConcept =
        attentionConcepts[0];

    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="ai-tutor-page">

            {/* =================================
                LEFT SIDEBAR
            ================================= */}

            <aside className="tutor-sidebar">

                <div className="tutor-brand">
                    <div className="tutor-brand-icon">
                        ✦
                    </div>

                    <span>
                        AI Study Companion
                    </span>
                </div>

                {/* PROJECTS */}

                <div className="sidebar-section">

                    <div className="sidebar-section-title">
                        PROJECTS
                    </div>

                    <button
                        className="project-sidebar-item active"
                    >
                        <span className="sidebar-folder">
                            □
                        </span>

                        <span>
                            {project?.name ||
                                "Current Project"}
                        </span>
                    </button>

                    <button
                        className="project-sidebar-item"
                        onClick={() =>
                            navigate("/home")
                        }
                    >
                        <span className="sidebar-folder">
                            □
                        </span>

                        <span>
                            All Projects
                        </span>
                    </button>

                </div>

                {/* MATERIALS */}

                <div className="sidebar-section">

                    <div className="sidebar-section-title">
                        MATERIALS
                    </div>

                    {materials.length === 0 ? (
                        <div className="empty-materials">
                            No materials yet
                        </div>
                    ) : (
                        materials.map((material) => (
                            <div
                                className="material-sidebar-item"
                                key={material.id}
                            >
                                <span className="material-icon">
                                    ▧
                                </span>

                                <span className="material-name">
                                    {material.fileName}
                                </span>
                            </div>
                        ))
                    )}

                </div>

                {/* BOTTOM */}

                <div className="tutor-sidebar-bottom">

                    <button
                        onClick={() =>
                            navigate("/home")
                        }
                    >
                        ← Back to Dashboard
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

                    </div>

                </div>

            </aside>


            {/* =================================
                CENTER
            ================================= */}

            <main className="tutor-main">

                {/* TOP BAR */}

                <header className="tutor-topbar">

                    <div>
                        <div className="tutor-page-title">
                            AI Tutor
                        </div>

                        <div className="tutor-page-subtitle">
                            Learn with your project
                            materials
                        </div>
                    </div>

                    <div className="using-project">
                        Using:{" "}
                        <strong>
                            {project?.name}
                        </strong>
                    </div>

                </header>


                {/* CONVERSATION */}

                <div className="tutor-conversation">

                    <div className="conversation-content">

                        {messages.map((message, index) => (

                            <div
                                key={index}
                                className={
                                    message.type === "user"
                                        ? "user-message"
                                        : "ai-response"
                                }
                            >

                                {message.type === "user" ? (

                                    <div className="user-message-content">
                                        {message.content}
                                    </div>

                                ) : (

                                    <div className="ai-response-content">

                                        <div className="ai-response-header">

                                            <strong>
                                                AI Tutor
                                            </strong>

                                            <span>
                                                Grounded response
                                            </span>

                                        </div>

                                        <div className="ai-answer">

                                            <ReactMarkdown>
                                                {message.content}
                                            </ReactMarkdown>

                                        </div>

                                        {message.citations?.length > 0 && (

                                            <div className="reference-grid">

                                                {message.citations.map(
                                                    (citation, citationIndex) => (

                                                        <div
                                                            className="reference-card"
                                                            key={citationIndex}
                                                        >

                                                            <div className="reference-icon">
                                                                📄
                                                            </div>

                                                            <div className="reference-content">

                                                                <strong>
                                                                    {citation.fileName}
                                                                </strong>

                                                                <span>
                                                                    Page{" "}
                                                                    {citation.pageNumber}
                                                                </span>

                                                            </div>

                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        )}

                                    </div>

                                )}

                            </div>

                        ))}

                        {tutorLoading && (

                            <div className="ai-response">

                                <div className="ai-response-avatar">
                                    ✦
                                </div>

                                <div className="ai-response-content">

                                    <div className="ai-response-header">

                                        <strong>
                                            AI Tutor
                                        </strong>

                                        <span>
                                            Thinking...
                                        </span>

                                    </div>

                                    <div className="thinking">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>

                                </div>

                            </div>

                        )}

                    </div>

                </div>


                {/* INPUT */}

                <div className="tutor-input-wrapper">

                    <textarea
                        value={question}
                        onChange={(event) =>
                            setQuestion(
                                event.target.value
                            )
                        }
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything about your project..."
                        rows="1"
                    />

                    <button
                        className="send-button"
                        onClick={handleAskTutor}
                        disabled={
                            tutorLoading ||
                            !question.trim()
                        }
                    >
                        ➤
                    </button>

                </div>

            </main>


            {/* =================================
                RIGHT LEARNING CONTEXT
            ================================= */}

            <aside className="learning-context">

                <div className="context-title">
                    Learning context
                </div>

                {/* MASTERY */}

                <section className="context-card mastery-card">

                    <div
                        className="mastery-ring"
                        style={{
                            "--mastery":
                                `${mastery * 3.6}deg`
                        }}
                    >
                        <span>
                            {mastery}%
                        </span>
                    </div>

                    <div>
                        <strong>
                            Overall mastery
                        </strong>

                        <span className="growth-badge">
                            +6% this week
                        </span>
                    </div>

                </section>


                {/* NEEDS ATTENTION */}

                <section className="context-card">

                    <h3>
                        Needs attention
                    </h3>

                    {attentionConcepts.length ===
                        0 ? (
                        <p className="context-muted">
                            No concepts currently
                            need attention.
                        </p>
                    ) : (
                        attentionConcepts.map(
                            (concept, index) => {

                                const score = Math.round(
                                    Number(
                                        concept.mastery ??
                                        concept.masteryScore ??
                                        0
                                    ) *
                                    100
                                );

                                return (
                                    <div
                                        className="attention-item"
                                        key={index}
                                    >

                                        <div className="attention-header">

                                            <span>
                                                {
                                                    concept.conceptName ||
                                                    concept.name ||
                                                    "Concept"
                                                }
                                            </span>

                                            <span>
                                                {score}%
                                            </span>

                                        </div>

                                        <div className="attention-bar">

                                            <div
                                                style={{
                                                    width: `${score}%`
                                                }}
                                            />

                                        </div>

                                    </div>
                                );
                            }
                        )
                    )}

                </section>


                {/* RECOMMENDATION */}

                <section className="context-card recommendation-card">

                    <div className="recommendation-heading">

                        <span>
                            ♧
                        </span>

                        <strong>
                            Recommended next
                        </strong>

                    </div>

                    <p>
                        {recommendedConcept
                            ? `Practice ${recommendedConcept.conceptName || recommendedConcept.name}.`
                            : "Keep practicing concepts that need more attention."}
                    </p>

                    <button
                        onClick={() =>
                            setQuestion(
                                recommendedConcept
                                    ? `Help me practice ${recommendedConcept.conceptName || recommendedConcept.name}.`
                                    : "What should I practice next?"
                            )
                        }
                    >
                        Practice this concept
                    </button>

                </section>

            </aside>

        </div>
    );
}

export default AITutor;