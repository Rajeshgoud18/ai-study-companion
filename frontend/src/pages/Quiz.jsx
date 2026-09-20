import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api.js";
import { getProject } from "../services/projectService.js";
import "./Quiz.css";

export default function Quiz() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [quiz, setQuiz] = useState(null);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [answers, setAnswers] = useState({});

    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        loadProject();
    }, [projectId]);

    const loadProject = async () => {
        try {
            setLoading(true);

            const response = await getProject(projectId);
            setProject(response);

        } catch (err) {
            console.error("Failed to load project:", err);
            setError("Failed to load project.");
        } finally {
            setLoading(false);
        }
    };

    const generateQuiz = async () => {
        try {
            setGenerating(true);
            setError("");
            setResult(null);

            const response = await api.post(
                `/ai/quiz/generate?projectId=${projectId}`
            );

            const generatedQuiz = response.data;

            /*
             * QuizGenerationResponse contains:
             * quizId
             * projectId
             * totalQuestions
             * questions
             */

            const quizResponse = await api.get(
                `/ai/quiz/${generatedQuiz.quizId}?projectId=${projectId}`
            );

            setQuiz(quizResponse.data);
            setCurrentQuestion(0);
            setSelectedAnswer("");
            setAnswers({});

        } catch (err) {
            console.error("Failed to generate quiz:", err);

            setError(
                err?.response?.data?.message ||
                "Failed to generate quiz. Make sure your project has concepts."
            );
        } finally {
            setGenerating(false);
        }
    };

    const selectAnswer = (answer) => {
        if (submitting || result) return;

        setSelectedAnswer(answer);

        setAnswers((previous) => ({
            ...previous,
            [quiz.questions[currentQuestion].questionId]: answer
        }));
    };

    const submitAnswer = async () => {
        if (!selectedAnswer || submitting) return;

        const question = quiz.questions[currentQuestion];

        try {
            setSubmitting(true);
            setError("");

            const response = await api.post(
                `/ai/quiz/${quiz.quizId}/answer?projectId=${projectId}`,
                {
                    questionId: question.questionId,
                    answer: selectedAnswer
                }
            );

            const answerResult = response.data;

            if (currentQuestion === quiz.questions.length - 1) {
                setResult({
                    completed: true
                });

                return;
            }

            setCurrentQuestion((previous) => previous + 1);

            const nextQuestionId =
                quiz.questions[currentQuestion + 1].questionId;

            setSelectedAnswer(
                answers[nextQuestionId] || ""
            );

        } catch (err) {
            console.error("Failed to submit answer:", err);

            setError(
                err?.response?.data?.message ||
                "Failed to submit answer."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const restartQuiz = () => {
        setQuiz(null);
        setResult(null);
        setCurrentQuestion(0);
        setSelectedAnswer("");
        setAnswers({});
        setError("");
    };

    const openGrowth = () => {
        navigate(`/project/${projectId}/growth`);
    };

    const openMastery = () => {
        navigate(`/project/${projectId}/mastery`);
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

    const openAssessment = () => {
        navigate(`/project/${projectId}/assessment`);
    };

    const openAnalytics = () => {
        navigate(`/project/${projectId}/analytics`);
    };

    if (loading) {
        return (
            <div className="quiz-page">
                <div className="quiz-loading">
                    Loading project...
                </div>
            </div>
        );
    }

    const questions = quiz?.questions || [];
    const question = questions[currentQuestion];

    return (
        <div className="quiz-page">

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

                <div className="sidebar-section project-section">

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
                        className="project-nav-item active"
                    >
                        <span>✓</span>
                        Quiz
                    </button>

                    <button
                        className="project-nav-item"
                        onClick={openAssessment}
                    >
                        <span>✎</span>
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
                        onClick={openAnalytics}
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

            <main className="quiz-main">

                {/* TOPBAR */}

                <header className="quiz-topbar">

                    <div className="breadcrumbs">
                        <span>Projects</span>
                        <span>/</span>
                        <strong>{project?.name || "Project"}</strong>
                        <span>/</span>
                        <strong>Quiz</strong>
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

                {/* CONTENT */}

                <section className="quiz-content">

                    {!quiz && !result && (
                        <div className="quiz-intro">

                            <div className="quiz-eyebrow">
                                PRACTICE
                            </div>

                            <h1>
                                Test your understanding
                            </h1>

                            <p>
                                Take an adaptive quiz based on the
                                concepts you've learned in this project.
                            </p>

                            <div className="quiz-info-grid">

                                <div className="quiz-info-card">
                                    <span className="info-icon">
                                        ?
                                    </span>

                                    <div>
                                        <strong>5 questions</strong>
                                        <span>
                                            Multiple-choice questions
                                        </span>
                                    </div>
                                </div>

                                <div className="quiz-info-card">
                                    <span className="info-icon">
                                        ◇
                                    </span>

                                    <div>
                                        <strong>Concept focused</strong>
                                        <span>
                                            Based on your project concepts
                                        </span>
                                    </div>
                                </div>

                                <div className="quiz-info-card">
                                    <span className="info-icon">
                                        ↗
                                    </span>

                                    <div>
                                        <strong>Improve mastery</strong>
                                        <span>
                                            Results update your progress
                                        </span>
                                    </div>
                                </div>

                            </div>

                            {error && (
                                <div className="quiz-error">
                                    {error}
                                </div>
                            )}

                            <button
                                className="generate-quiz-btn"
                                onClick={generateQuiz}
                                disabled={generating}
                            >
                                {generating
                                    ? "Generating quiz..."
                                    : "Start quiz →"}
                            </button>

                        </div>
                    )}

                    {quiz && !result && question && (
                        <div className="quiz-container">

                            <div className="quiz-header">

                                <div>
                                    <div className="quiz-eyebrow">
                                        KNOWLEDGE CHECK
                                    </div>

                                    <h1>
                                        Project Quiz
                                    </h1>
                                </div>

                                <div className="question-counter">
                                    Question{" "}
                                    <strong>
                                        {currentQuestion + 1}
                                    </strong>{" "}
                                    of {questions.length}
                                </div>

                            </div>

                            <div className="quiz-progress">
                                <div
                                    style={{
                                        width: `${
                                            ((currentQuestion + 1) /
                                                questions.length) *
                                            100
                                        }%`
                                    }}
                                />
                            </div>

                            <div className="question-card">

                                <div className="question-meta">

                                    <span className="concept-badge">
                                        {question.conceptName}
                                    </span>

                                    <span className="difficulty-badge">
                                        Difficulty {question.difficulty}
                                    </span>

                                </div>

                                <h2>
                                    {question.questionText}
                                </h2>

                                <div className="options-list">

                                    {question.options.map(
                                        (option, index) => {

                                            const optionLetter =
                                                String.fromCharCode(
                                                    65 + index
                                                );

                                            const selected =
                                                selectedAnswer === option;

                                            return (
                                                <button
                                                    key={option}
                                                    className={`quiz-option ${
                                                        selected
                                                            ? "selected"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        selectAnswer(option)
                                                    }
                                                    disabled={submitting}
                                                >
                                                    <span className="option-letter">
                                                        {optionLetter}
                                                    </span>

                                                    <span>
                                                        {option}
                                                    </span>

                                                    {selected && (
                                                        <span className="option-check">
                                                            ✓
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        }
                                    )}

                                </div>

                                {error && (
                                    <div className="quiz-error">
                                        {error}
                                    </div>
                                )}

                                <div className="question-footer">

                                    <span>
                                        Choose the best answer.
                                    </span>

                                    <button
                                        className="submit-answer-btn"
                                        onClick={submitAnswer}
                                        disabled={
                                            !selectedAnswer ||
                                            submitting
                                        }
                                    >
                                        {submitting
                                            ? "Checking..."
                                            : currentQuestion ===
                                                questions.length - 1
                                                ? "Finish quiz"
                                                : "Submit answer →"}
                                    </button>

                                </div>

                            </div>

                        </div>
                    )}

                    {result && (
                        <div className="quiz-result">

                            <div className="result-icon">
                                ✓
                            </div>

                            <div className="quiz-eyebrow">
                                QUIZ COMPLETED
                            </div>

                            <h1>
                                Nice work!
                            </h1>

                            <p>
                                You've completed this quiz.
                                Your mastery and recommendations
                                have been updated.
                            </p>

                            <div className="result-card">

                                <div>
                                    <strong>
                                        {Object.keys(answers).length}
                                    </strong>

                                    <span>
                                        Questions answered
                                    </span>
                                </div>

                                <div>
                                    <strong>
                                        ✓
                                    </strong>

                                    <span>
                                        Progress updated
                                    </span>
                                </div>

                            </div>

                            <div className="result-actions">

                                <button
                                    className="generate-quiz-btn"
                                    onClick={openGrowth}
                                >
                                    View growth →
                                </button>

                                <button
                                    className="secondary-btn"
                                    onClick={restartQuiz}
                                >
                                    Take another quiz
                                </button>

                            </div>

                        </div>
                    )}

                </section>

            </main>

        </div>
    );
}