import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService.js";
import "./Register.css";

const SparkleIcon = () => (
    <svg viewBox="0 0 24 24" fill="none">
        <path
            d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z"
            fill="currentColor"
        />
    </svg>
);

const UserIcon = () => (
    <svg viewBox="0 0 24 24" fill="none">
        <circle
            cx="12"
            cy="8"
            r="3.5"
            stroke="currentColor"
            strokeWidth="1.7"
        />
        <path
            d="M5 20C5.8 16.6 8.1 14.8 12 14.8C15.9 14.8 18.2 16.6 19 20"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
        />
    </svg>
);

const MailIcon = () => (
    <svg viewBox="0 0 24 24" fill="none">
        <rect
            x="3.5"
            y="5"
            width="17"
            height="14"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.7"
        />
        <path
            d="M4.5 7L12 13L19.5 7"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const LockIcon = () => (
    <svg viewBox="0 0 24 24" fill="none">
        <rect
            x="5"
            y="10"
            width="14"
            height="10"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.7"
        />
        <path
            d="M8 10V7.5C8 5.29 9.79 3.5 12 3.5C14.21 3.5 16 5.29 16 7.5V10"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
        />
    </svg>
);

const EyeIcon = ({ hidden }) => (
    <svg viewBox="0 0 24 24" fill="none">
        {hidden ? (
            <>
                <path
                    d="M3 3L21 21"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                />
                <path
                    d="M10.6 10.6C10.23 10.97 10 11.47 10 12C10 13.1 10.9 14 12 14C12.53 14 13.03 13.77 13.4 13.4"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                />
                <path
                    d="M9.88 5.1C10.56 4.9 11.27 4.8 12 4.8C17.3 4.8 20.5 12 20.5 12C20.5 12 19.32 14.65 17.1 16.65"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                />
                <path
                    d="M6.1 6.3C4.25 8.03 3.5 10.2 3.5 12C3.5 12 6.7 19.2 12 19.2C13.27 19.2 14.45 18.82 15.5 18.24"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                />
            </>
        ) : (
            <>
                <path
                    d="M2.8 12C2.8 12 6.1 5 12 5C17.9 5 21.2 12 21.2 12C21.2 12 17.9 19 12 19C6.1 19 2.8 12 2.8 12Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                />
                <circle
                    cx="12"
                    cy="12"
                    r="2.8"
                    stroke="currentColor"
                    strokeWidth="1.7"
                />
            </>
        )}
    </svg>
);

const CheckIcon = () => (
    <span className="password-check">✓</span>
);

const CrossIcon = () => (
    <span className="password-cross">×</span>
);

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [created, setCreated] = useState(false);

    const passwordRules = {
        length: formData.password.length >= 8,
        uppercase: /[A-Z]/.test(formData.password),
        number: /\d/.test(formData.password),
        special: /[^A-Za-z0-9]/.test(formData.password),
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");

        setFieldErrors((previous) => ({
            ...previous,
            [name]: "",
        }));
    };

    const validate = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            errors.email = "Email is required";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            errors.email = "Enter a valid email address";
        }

        if (!formData.password) {
            errors.password = "Password is required";
        } else if (formData.password.length < 8) {
            errors.password = "Password must be at least 8 characters";
        }

        setFieldErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!validate()) {
            return;
        }

        try {
            setLoading(true);

            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            setCreated(true);
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                "Unable to create your account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    if (created) {
        return (
            <div className="auth-page">

                <div className="auth-background-glow auth-glow-left"></div>
                <div className="auth-background-glow auth-glow-right"></div>

                <div className="auth-container">

                    <Link to="/" className="auth-brand">
                        <span className="auth-brand-icon">
                            <SparkleIcon />
                        </span>

                        <span>AI Study Companion</span>
                    </Link>

                    <div className="auth-card account-created-card">

                        <div className="success-icon">
                            ✓
                        </div>

                        <h1>
                            Account created
                        </h1>

                        <p>
                            Welcome, {formData.name}. Create your first
                            Space to begin your learning loop.
                        </p>

                        <button
                            className="auth-submit"
                            onClick={() => navigate("/login")}
                        >
                            → &nbsp; Create your first Space
                        </button>

                    </div>

                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">

            <div className="auth-background-glow auth-glow-left"></div>
            <div className="auth-background-glow auth-glow-right"></div>

            <div className="auth-container register-container">

                {/* Brand */}

                <Link to="/" className="auth-brand">
                    <span className="auth-brand-icon">
                        <SparkleIcon />
                    </span>

                    <span>AI Study Companion</span>
                </Link>

                {/* Register card */}

                <div className="auth-card register-card">

                    <div className="auth-card-heading">
                        <h1>Create your account</h1>

                        <p>
                            Start turning your materials into mastery.
                        </p>
                    </div>

                    {error && (
                        <div className="register-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        {/* Name */}

                        <div className="auth-field">

                            <label htmlFor="register-name">
                                Name
                            </label>

                            <div
                                className={`auth-input-wrapper ${
                                    fieldErrors.name ? "has-error" : ""
                                }`}
                            >
                                <UserIcon />

                                <input
                                    id="register-name"
                                    name="name"
                                    type="text"
                                    placeholder="Rajesh"
                                    value={formData.name}
                                    onChange={handleChange}
                                    autoComplete="name"
                                />
                            </div>

                            {fieldErrors.name && (
                                <span className="field-error">
                                    {fieldErrors.name}
                                </span>
                            )}

                        </div>

                        {/* Email */}

                        <div className="auth-field">

                            <label htmlFor="register-email">
                                Email
                            </label>

                            <div
                                className={`auth-input-wrapper ${
                                    fieldErrors.email ? "has-error" : ""
                                }`}
                            >
                                <MailIcon />

                                <input
                                    id="register-email"
                                    name="email"
                                    type="email"
                                    placeholder="you@university.edu"
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                />
                            </div>

                            {fieldErrors.email && (
                                <span className="field-error">
                                    {fieldErrors.email}
                                </span>
                            )}

                        </div>

                        {/* Password */}

                        <div className="auth-field">

                            <label htmlFor="register-password">
                                Password
                            </label>

                            <div
                                className={`auth-input-wrapper ${
                                    fieldErrors.password ? "has-error" : ""
                                }`}
                            >
                                <LockIcon />

                                <input
                                    id="register-password"
                                    name="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            (previous) => !previous
                                        )
                                    }
                                >
                                    <EyeIcon hidden={showPassword} />
                                </button>

                            </div>

                            {fieldErrors.password && (
                                <span className="field-error">
                                    {fieldErrors.password}
                                </span>
                            )}

                        </div>

                        {/* Password requirements */}

                        <div className="password-requirements">

                            <div className="requirements-title">
                                Password requirements
                            </div>

                            <div className={
                                passwordRules.length
                                    ? "requirement valid"
                                    : "requirement"
                            }>
                                {passwordRules.length
                                    ? <CheckIcon />
                                    : <CrossIcon />
                                }

                                <span>
                                    At least 8 characters
                                </span>
                            </div>

                            <div className={
                                passwordRules.uppercase &&
                                passwordRules.number
                                    ? "requirement valid"
                                    : "requirement"
                            }>
                                {passwordRules.uppercase &&
                                passwordRules.number
                                    ? <CheckIcon />
                                    : <CrossIcon />
                                }

                                <span>
                                    One uppercase letter and one number
                                </span>
                            </div>

                            <div className={
                                passwordRules.special
                                    ? "requirement valid"
                                    : "requirement"
                            }>
                                {passwordRules.special
                                    ? <CheckIcon />
                                    : <CrossIcon />
                                }

                                <span>
                                    One special character
                                </span>
                            </div>

                        </div>

                        {/* Submit */}

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating account..."
                                : "Create account"
                            }
                        </button>

                    </form>

                    <div className="auth-switch">

                        <span>
                            Already have an account?
                        </span>

                        <Link to="/login">
                            Sign in
                        </Link>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default Register;