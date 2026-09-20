import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";
import { getProject } from "../services/projectService.js";
import { useAuth } from "../context/AuthContext.jsx";
import "./Assessment.css";

export default function Assessment() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [project, setProject] = useState(null);
    const [concepts, setConcepts] = useState([]);

    const [conceptId, setConceptId] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [evaluating, setEvaluating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadAssessmentData();
    }, [projectId]);

    const loadAssessmentData = async () => {
        try {
            setLoading(true);
            setError("");

            const projectResponse = await getProject(projectId);

            setProject(projectResponse);

            /*
             * Get current concept/mastery information.
             * The growth endpoint already returns the project's concepts.
             */
            const growthResponse = await api.get(
                `/ai/growth?projectId=${projectId}`
            );

            const projectConcepts =
                growthResponse.data?.concepts || [];

            setConcepts(projectConcepts);

            if (projectConcepts.length > 0) {
                setConceptId(
                    String(projectConcepts[0].conceptId)
                );
            }

        } catch (err) {
            console.error(
                "Failed to load assessment data:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to load assessment."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!conceptId) {
            setError("Please select a concept.");
            return;
        }

        if (!question.trim()) {
            setError("Please enter a question.");
            return;
        }

        if (!answer.trim()) {
            setError("Please enter your answer.");
            return;
        }

        try {
            setEvaluating(true);
            setError("");
            setResult(null);

            const userId = user?.userId;

            if (!userId) {
                setError("User session not found. Please login again.");
                return;
            }


            if (!userId) {
                setError(
                    "User session not found. Please login again."
                );
                return;
            }

            const response = await api.post(
                `/assessments?userId=${userId}&projectId=${projectId}`,
                {
                    conceptId: Number(conceptId),
                    question: question.trim(),
                    answer: answer.trim()
                }
            );

            setResult(response.data);

        } catch (err) {
            console.error(
                "Assessment evaluation failed:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to evaluate your answer."
            );
        } finally {
            setEvaluating(false);
        }
    };

    const resetAssessment = () => {
        setQuestion("");
        setAnswer("");
        setResult(null);
        setError("");
    };

    const mastery = result?.overallScore != null
        ? Math.round(result.overallScore * 100)
        : 0;

    const scoreValue = (value) =>
        Math.round((value ?? 0) * 100);

    const getScoreClass = (score) => {
        if (score >= 70) return "score-good";
        if (score >= 40) return "score-medium";
        return "score-low";
    };

    const go = (path) => {
        navigate(`/project/${projectId}/${path}`);
    };

    if (loading) {
        return (
            <div className="assessment-page">
                <div className="assessment-loading">
                    Loading assessment...
                </div>
            </div>
        );
    }

    return (
        <div className="assessment-page">

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

                    <button className="project-nav-item active">
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

            <main className="assessment-main">

                <header className="assessment-topbar">

                    <div className="breadcrumbs">

                        <span>Projects</span>
                        <span>/</span>

                        <strong>
                            {project?.name || "Project"}
                        </strong>

                        <span>/</span>

                        <strong>
                            Assessment
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

                <section className="assessment-content">

                    {/* ================= HEADER ================= */}

                    <div className="assessment-heading">

                        <span className="assessment-eyebrow">
                            KNOWLEDGE CHECK
                        </span>

                        <h1>
                            Assess your understanding
                        </h1>

                        <p>
                            Explain a concept in your own words
                            and let your AI evaluator give you
                            detailed feedback.
                        </p>

                    </div>

                    {error && (
                        <div className="assessment-error">
                            {error}
                        </div>
                    )}

                    {!result ? (

                        /* ================= FORM ================= */

                        <form
                            className="assessment-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="assessment-card">

                                <div className="card-header">

                                    <div>
                                        <span className="card-eyebrow">
                                            STEP 01
                                        </span>

                                        <h2>
                                            Choose a concept
                                        </h2>

                                        <p>
                                            Select the concept you
                                            want to assess.
                                        </p>
                                    </div>

                                </div>

                                <select
                                    value={conceptId}
                                    onChange={(e) =>
                                        setConceptId(
                                            e.target.value
                                        )
                                    }
                                    className="concept-select"
                                >
                                    <option value="">
                                        Select a concept
                                    </option>

                                    {concepts.map(
                                        (concept) => (
                                            <option
                                                key={
                                                    concept.conceptId
                                                }
                                                value={
                                                    concept.conceptId
                                                }
                                            >
                                                {
                                                    concept.conceptName
                                                }
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                            <div className="assessment-card">

                                <div className="card-header">

                                    <div>
                                        <span className="card-eyebrow">
                                            STEP 02
                                        </span>

                                        <h2>
                                            Ask yourself a question
                                        </h2>

                                        <p>
                                            Enter a question that
                                            tests your understanding.
                                        </p>
                                    </div>

                                </div>

                                <textarea
                                    className="question-input"
                                    value={question}
                                    onChange={(e) =>
                                        setQuestion(
                                            e.target.value
                                        )
                                    }
                                    placeholder="For example: What is Spring Boot auto-configuration and how does it work?"
                                    rows={4}
                                />

                            </div>

                            <div className="assessment-card">

                                <div className="card-header">

                                    <div>
                                        <span className="card-eyebrow">
                                            STEP 03
                                        </span>

                                        <h2>
                                            Explain your answer
                                        </h2>

                                        <p>
                                            Answer in your own words.
                                            Focus on explaining the
                                            concept clearly.
                                        </p>
                                    </div>

                                </div>

                                <textarea
                                    className="answer-input"
                                    value={answer}
                                    onChange={(e) =>
                                        setAnswer(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Write your answer here..."
                                    rows={9}
                                />

                                <div className="answer-footer">

                                    <span>
                                        {answer.length} characters
                                    </span>

                                    <button
                                        type="submit"
                                        className="evaluate-button"
                                        disabled={evaluating}
                                    >
                                        {evaluating
                                            ? "Evaluating..."
                                            : "Evaluate answer →"}
                                    </button>

                                </div>

                            </div>

                        </form>

                    ) : (

                        /* ================= RESULT ================= */

                        <section className="assessment-result">

                            <div className="result-hero">

                                <div className="result-score">

                                    <div
                                        className={`score-circle ${getScoreClass(
                                            mastery
                                        )}`}
                                    >
                                        <strong>
                                            {mastery}%
                                        </strong>

                                        <span>
                                            overall
                                        </span>
                                    </div>

                                </div>

                                <div className="result-summary">

                                    <span className="result-eyebrow">
                                        ASSESSMENT COMPLETE
                                    </span>

                                    <h2>
                                        Here's how you did
                                    </h2>

                                    <p>
                                        Your answer was evaluated
                                        across understanding,
                                        accuracy, relevance and
                                        reasoning.
                                    </p>

                                </div>

                            </div>

                            {/* SCORE BREAKDOWN */}

                            <div className="result-section">

                                <div className="result-section-heading">

                                    <span className="card-eyebrow">
                                        SCORE BREAKDOWN
                                    </span>

                                    <h2>
                                        Evaluation
                                    </h2>

                                </div>

                                <div className="score-grid">

                                    <ScoreCard
                                        label="Understanding"
                                        score={scoreValue(
                                            result.understandingScore
                                        )}
                                    />

                                    <ScoreCard
                                        label="Accuracy"
                                        score={scoreValue(
                                            result.accuracyScore
                                        )}
                                    />

                                    <ScoreCard
                                        label="Relevance"
                                        score={scoreValue(
                                            result.relevanceScore
                                        )}
                                    />

                                    <ScoreCard
                                        label="Reasoning"
                                        score={scoreValue(
                                            result.reasoningScore
                                        )}
                                    />

                                </div>

                            </div>

                            {/* FEEDBACK */}

                            <div className="feedback-card">

                                <div className="feedback-icon">
                                    ✦
                                </div>

                                <div>

                                    <span className="card-eyebrow">
                                        AI FEEDBACK
                                    </span>

                                    <h3>
                                        Feedback on your answer
                                    </h3>

                                    <p>
                                        {result.feedback ||
                                            "No feedback was provided."}
                                    </p>

                                </div>

                            </div>

                            {/* MISSING CONCEPTS */}

                            {result.missingConcepts?.length > 0 && (

                                <div className="missing-card">

                                    <span className="card-eyebrow">
                                        AREAS TO EXPLORE
                                    </span>

                                    <h3>
                                        Concepts to revisit
                                    </h3>

                                    <div className="missing-list">

                                        {result.missingConcepts.map(
                                            (concept, index) => (
                                                <span
                                                    key={index}
                                                    className="missing-pill"
                                                >
                                                    {concept}
                                                </span>
                                            )
                                        )}

                                    </div>

                                </div>

                            )}

                            {/* ACTIONS */}

                            <div className="result-actions">

                                <button
                                    className="secondary-action"
                                    onClick={resetAssessment}
                                >
                                    New assessment
                                </button>

                                <button
                                    className="primary-action"
                                    onClick={() =>
                                        go("mastery")
                                    }
                                >
                                    View mastery →
                                </button>

                            </div>

                        </section>

                    )}

                </section>

            </main>

        </div>
    );
}


/* ================= SCORE CARD ================= */

function ScoreCard({ label, score }) {
    const scoreClass =
        score >= 70
            ? "score-good"
            : score >= 40
                ? "score-medium"
                : "score-low";

    return (
        <div className="score-card">

            <div className="score-card-top">

                <span>
                    {label}
                </span>

                <strong className={scoreClass}>
                    {score}%
                </strong>

            </div>

            <div className="score-bar">
                <div
                    className={scoreClass}
                    style={{
                        width: `${score}%`
                    }}
                />
            </div>

        </div>
    );
}