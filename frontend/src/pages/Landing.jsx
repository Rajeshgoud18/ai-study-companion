import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

const Icon = ({ children, className = "" }) => (
    <div className={`landing-icon ${className}`}>
        {children}
    </div>
);

const Sparkle = () => (
    <svg viewBox="0 0 24 24" fill="none">
        <path
            d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z"
            fill="currentColor"
        />
    </svg>
);

const ArrowRight = () => (
    <svg viewBox="0 0 24 24" fill="none">
        <path
            d="M5 12H19M13 6L19 12L13 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const BookIcon = () => (
    <svg viewBox="0 0 24 24" fill="none">
        <path
            d="M5 4.5C5 3.67 5.67 3 6.5 3H19V19H6.5C5.67 19 5 19.67 5 20.5V4.5Z"
            stroke="currentColor"
            strokeWidth="1.7"
        />
        <path
            d="M5 20.5C5 19.67 5.67 19 6.5 19H19"
            stroke="currentColor"
            strokeWidth="1.7"
        />
    </svg>
);

const FolderIcon = () => (
    <svg viewBox="0 0 24 24" fill="none">
        <path
            d="M3.5 6.5C3.5 5.67 4.17 5 5 5H10L12 7H19C19.83 7 20.5 7.67 20.5 8.5V18C20.5 18.83 19.83 19.5 19 19.5H5C4.17 19.5 3.5 18.83 3.5 18V6.5Z"
            stroke="currentColor"
            strokeWidth="1.7"
        />
    </svg>
);

const UploadIcon = () => (
    <svg viewBox="0 0 24 24" fill="none">
        <path
            d="M12 16V4M12 4L7.5 8.5M12 4L16.5 8.5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M5 13V18C5 19.1 5.9 20 7 20H17C18.1 20 19 19.1 19 18V13"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
        />
    </svg>
);

const QuestionIcon = () => (
    <svg viewBox="0 0 24 24" fill="none">
        <circle
            cx="12"
            cy="12"
            r="8.5"
            stroke="currentColor"
            strokeWidth="1.7"
        />
        <path
            d="M9.7 9.3C9.9 7.8 11 7 12.4 7C14 7 15 8 15 9.3C15 10.7 14.1 11.3 13 12C12.2 12.5 12 13 12 14"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
        />
        <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
);

const ChartIcon = () => (
    <svg viewBox="0 0 24 24" fill="none">
        <path
            d="M5 19V11M12 19V6M19 19V3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
        />
    </svg>
);

const TrendIcon = () => (
    <svg viewBox="0 0 24 24" fill="none">
        <path
            d="M4 16L9 11L13 14L20 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M15 6H20V11"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const LayersIcon = () => (
    <svg viewBox="0 0 24 24" fill="none">
        <path
            d="M12 4L20 8L12 12L4 8L12 4Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
        />
        <path
            d="M4 12L12 16L20 12"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
        />
        <path
            d="M4 16L12 20L20 16"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
        />
    </svg>
);

const features = [
    {
        icon: <Sparkle />,
        title: "Context-aware AI Tutor",
        description:
            "A tutor that knows your project, your goals and exactly where you struggle.",
    },
    {
        icon: <BookIcon />,
        title: "Grounded answers with citations",
        description:
            "Every answer links back to the page in your materials it came from.",
    },
    {
        icon: <QuestionIcon />,
        title: "Adaptive quizzes",
        description:
            "Practice that adapts to your mastery, always at the edge of what you know.",
    },
    {
        icon: <ChartIcon />,
        title: "Concept mastery",
        description:
            "Track understanding concept by concept — not just a single score.",
    },
    {
        icon: <TrendIcon />,
        title: "Growth analysis",
        description:
            "See how mastery, activity and quiz performance change over time.",
    },
    {
        icon: <Sparkle />,
        title: "Personalized recommendations",
        description:
            "Always know what to learn next, and why it matters.",
    },
];

const learningSteps = [
    {
        number: "01",
        title: "Create Space",
        icon: <LayersIcon />,
    },
    {
        number: "02",
        title: "Create Project",
        icon: <FolderIcon />,
    },
    {
        number: "03",
        title: "Add Materials",
        icon: <UploadIcon />,
    },
    {
        number: "04",
        title: "Learn with Tutor",
        icon: <Sparkle />,
        active: true,
    },
    {
        number: "05",
        title: "Practice",
        icon: <QuestionIcon />,
    },
    {
        number: "06",
        title: "Measure",
        icon: <ChartIcon />,
    },
    {
        number: "07",
        title: "Improve",
        icon: <TrendIcon />,
    },
];

function Landing() {
    const navigate = useNavigate();

    const goToRegister = () => {
        navigate("/register");
    };

    const goToLogin = () => {
        navigate("/login");
    };

    const scrollToFeatures = () => {
        document
            .getElementById("features")
            ?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="landing-page">

            {/* ================= HEADER ================= */}

            <header className="landing-header">
                <div className="landing-header-inner">

                    <button
                        className="landing-brand"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    >
                        <span className="brand-mark">
                            <Sparkle />
                        </span>

                        <span className="brand-name">
                            AI Study Companion
                        </span>
                    </button>

                    <nav className="landing-nav">
                        <button onClick={() => scrollToFeatures()}>
                            Product
                        </button>

                        <button onClick={() => {
                            document
                                .getElementById("learning-loop")
                                ?.scrollIntoView({ behavior: "smooth" });
                        }}>
                            How it works
                        </button>

                        <button onClick={() => scrollToFeatures()}>
                            Features
                        </button>
                    </nav>

                    <div className="landing-header-actions">
                        <button
                            className="header-signin"
                            onClick={goToLogin}
                        >
                            Sign in
                        </button>

                        <button
                            className="header-get-started"
                            onClick={goToRegister}
                        >
                            Get started
                        </button>
                    </div>

                </div>
            </header>

            {/* ================= HERO ================= */}

            <main>

                <section className="hero-section">

                    <div className="hero-content">

                        <div className="hero-badge">
                            <Sparkle />
                            <span>AI tutor grounded in your own learning materials</span>
                        </div>

                        <h1>
                            Learn smarter with an AI
                            <br />
                            companion that{" "}
                            <span>remembers how</span>
                            <br />
                            <span>you learn.</span>
                        </h1>

                        <p className="hero-description">
                            Bring your learning materials, ask questions, test your
                            understanding,
                            <br />
                            track mastery, and always know what to learn next.
                        </p>

                        <div className="hero-actions">

                            <button
                                className="primary-button"
                                onClick={goToRegister}
                            >
                                Start Learning
                                <ArrowRight />
                            </button>

                            <button
                                className="secondary-button"
                                onClick={scrollToFeatures}
                            >
                                See how it works
                            </button>

                        </div>

                    </div>

                    {/* ================= PRODUCT PREVIEW ================= */}

                    <div className="hero-preview-wrapper">

                        <div className="hero-glow"></div>

                        <div className="product-preview">

                            {/* Preview sidebar */}

                            <aside className="preview-sidebar">

                                <div className="preview-brand">
                                    <span className="preview-brand-icon">
                                        <Sparkle />
                                    </span>

                                    <span>AI Study Companion</span>
                                </div>

                                <div className="preview-label">
                                    PROJECTS
                                </div>

                                <div className="preview-project active">
                                    <span></span>
                                    Spring Boot Project
                                </div>

                                <div className="preview-project">
                                    <span></span>
                                    Microservices Patterns
                                </div>

                                <div className="preview-project">
                                    <span></span>
                                    Database Design
                                </div>

                                <div className="preview-project">
                                    <span></span>
                                    System Design Basics
                                </div>

                                <div className="preview-label materials-label">
                                    MATERIALS
                                </div>

                                <div className="preview-material">
                                    <BookIcon />
                                    springboot.pdf
                                </div>

                                <div className="preview-material">
                                    <BookIcon />
                                    java-guide.pdf
                                </div>

                            </aside>

                            {/* Preview tutor */}

                            <div className="preview-main">

                                <div className="preview-topbar">

                                    <strong>AI Tutor</strong>

                                    <span className="preview-project-pill">
                                        Using: Spring Boot Project
                                    </span>

                                </div>

                                <div className="preview-tutor-content">

                                    <div className="preview-tutor-message">
                                        <span className="small-sparkle">
                                            <Sparkle />
                                        </span>

                                        <div>
                                            <div className="preview-answer-button">
                                                Explain dependency injection in simple terms.
                                            </div>

                                            <p>
                                                Dependency injection is a design technique
                                                where an object receives the dependencies
                                                it needs instead of creating them itself.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="citation-row">

                                        <div className="citation-card">
                                            <BookIcon />
                                            <div>
                                                <strong>springboot.pdf</strong>
                                                <span>p. 14</span>
                                            </div>
                                        </div>

                                        <div className="citation-card">
                                            <BookIcon />
                                            <div>
                                                <strong>springboot.pdf</strong>
                                                <span>p. 22</span>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="preview-chips">
                                        <span>Explain simpler</span>
                                        <span>Give an example</span>
                                        <span>Quiz me</span>
                                    </div>

                                </div>

                                <div className="preview-input">
                                    <span>
                                        Ask anything about your project...
                                    </span>

                                    <button>
                                        <ArrowRight />
                                    </button>
                                </div>

                            </div>

                            {/* Preview context */}

                            <aside className="preview-context">

                                <div className="context-title">
                                    Learning context
                                </div>

                                <div className="mastery-card">

                                    <div className="mastery-circle">
                                        <span>72%</span>
                                    </div>

                                    <div>
                                        <strong>Overall mastery</strong>
                                        <span>+6% this week</span>
                                    </div>

                                </div>

                                <div className="attention-card">

                                    <strong>Needs attention</strong>

                                    <div className="attention-item">
                                        <span>IoC</span>
                                        <b>51%</b>
                                    </div>

                                    <div className="attention-progress">
                                        <span></span>
                                    </div>

                                    <div className="attention-item">
                                        <span>Spring Security</span>
                                        <b>42%</b>
                                    </div>

                                    <div className="attention-progress red">
                                        <span></span>
                                    </div>

                                </div>

                                <div className="recommendation-card">

                                    <div className="recommendation-title">
                                        <Sparkle />
                                        Recommended next
                                    </div>

                                    <p>
                                        Practice application-based questions
                                        on Dependency Injection.
                                    </p>

                                    <button onClick={goToRegister}>
                                        Practice this concept
                                    </button>

                                </div>

                            </aside>

                        </div>

                    </div>

                </section>

                {/* ================= FEATURES ================= */}

                <section
                    id="features"
                    className="features-section"
                >

                    <div className="section-heading">

                        <span className="section-eyebrow">
                            Features
                        </span>

                        <h2>
                            Everything you need to actually learn
                        </h2>

                        <p>
                            One workspace where materials, tutoring,
                            practice and progress reinforce each other.
                        </p>

                    </div>

                    <div className="feature-grid">

                        {features.map((feature, index) => (
                            <div
                                className="feature-card"
                                key={index}
                            >

                                <Icon>
                                    {feature.icon}
                                </Icon>

                                <h3>{feature.title}</h3>

                                <p>{feature.description}</p>

                            </div>
                        ))}

                    </div>

                </section>

                {/* ================= LEARNING LOOP ================= */}

                <section
                    id="learning-loop"
                    className="learning-loop-section"
                >

                    <div className="section-heading">

                        <span className="section-eyebrow">
                            How it works
                        </span>

                        <h2>
                            A learning loop that closes itself
                        </h2>

                        <p>
                            Every session feeds the next — practice reveals gaps,
                            and the tutor helps you close them.
                        </p>

                    </div>

                    <div className="learning-steps">

                        {learningSteps.map((step, index) => (
                            <React.Fragment key={step.number}>

                                <div
                                    className={`learning-step ${
                                        step.active ? "active" : ""
                                    }`}
                                >

                                    <div className="step-icon">
                                        {step.icon}
                                    </div>

                                    <span className="step-number">
                                        {step.number}
                                    </span>

                                    <strong>
                                        {step.title}
                                    </strong>

                                </div>

                            </React.Fragment>
                        ))}

                    </div>

                    <div className="loop-line">
                        <span>
                            ↻ &nbsp; Repeat and improve — recommendations feed the next session
                        </span>
                    </div>

                </section>

                {/* ================= CTA ================= */}

                <section className="cta-section">

                    <div className="cta-card">

                        <h2>
                            Turn your study materials into a
                            <br />
                            personalized learning system.
                        </h2>

                        <button
                            className="cta-button"
                            onClick={goToRegister}
                        >
                            Create your first project
                            <ArrowRight />
                        </button>

                    </div>

                </section>

            </main>

            {/* ================= FOOTER ================= */}

            <footer className="landing-footer">

                <div className="footer-brand">

                    <div className="footer-brand-row">

                        <span className="footer-mark">
                            <Sparkle />
                        </span>

                        <strong>
                            AI Study Companion
                        </strong>

                    </div>

                    <p>
                        Your personal AI learning partner.
                    </p>

                </div>

                <div className="footer-links">

                    <button onClick={() => scrollToFeatures()}>
                        Product
                    </button>

                    <button onClick={() => scrollToFeatures()}>
                        Features
                    </button>

                    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                        About
                    </button>

                    <button>
                        GitHub
                    </button>

                    <button>
                        Privacy
                    </button>

                    <button>
                        Terms
                    </button>

                </div>

            </footer>

        </div>
    );
}

export default Landing;