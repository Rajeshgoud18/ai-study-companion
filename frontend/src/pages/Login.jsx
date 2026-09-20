import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getHomePath } from "../utils/roles";
import "./Login.css";

const SparkleIcon = () => (
    <svg viewBox="0 0 24 24" fill="none">
        <path
            d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z"
            fill="currentColor"
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

const AlertIcon = () => (
    <svg viewBox="0 0 24 24" fill="none">
        <path
            d="M12 3L21 19H3L12 3Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
        />
        <path
            d="M12 9V13"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
        />
        <circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
);

const SpinnerIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" className="login-spinner">
        <path
            d="M12 4C16.42 4 20 7.58 20 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path
            d="M20 12C20 16.42 16.42 20 12 20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity=".35"
        />
    </svg>
);

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth(); // context login, so the user state gets updated

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (name === "email") {
            setEmailError("");
        }

        if (name === "password") {
            setPasswordError("");
        }

        setError("");
    };

    const validate = () => {
        let valid = true;

        setEmailError("");
        setPasswordError("");

        if (!formData.email.trim()) {
            setEmailError("Email is required");
            valid = false;
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            setEmailError("Enter a valid email address");
            valid = false;
        }

        if (!formData.password) {
            setPasswordError("Password is required");
            valid = false;
        } else if (formData.password.length < 8) {
            setPasswordError("Password must be at least 8 characters");
            valid = false;
        }

        return valid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!validate()) {
            return;
        }

        try {
            setLoading(true);

            const loggedInUser = await login({
                email: formData.email,
                password: formData.password,
            });

            // ADMIN -> /admin, everyone else -> /home
            navigate(getHomePath(loggedInUser), { replace: true });
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                "The email or password you entered is incorrect.";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-background-glow auth-glow-left"></div>
            <div className="auth-background-glow auth-glow-right"></div>

            <div className="auth-container">

                {/* Brand */}

                <Link to="/" className="auth-brand">
                    <span className="auth-brand-icon">
                        <SparkleIcon />
                    </span>

                    <span>AI Study Companion</span>
                </Link>

                {/* Login card */}

                <div className="auth-card login-card">

                    <div className="auth-card-heading">
                        <h1>Welcome back</h1>

                        <p>
                            Sign in to continue your learning loop.
                        </p>
                    </div>

                    {error && (
                        <div className="auth-error-box">

                            <AlertIcon />

                            <div>
                                <strong>Invalid credentials</strong>

                                <span>
                                    {error}
                                </span>
                            </div>

                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        {/* Email */}

                        <div className="auth-field">

                            <label htmlFor="login-email">
                                Email
                            </label>

                            <div
                                className={`auth-input-wrapper ${
                                    emailError ? "has-error" : ""
                                }`}
                            >
                                <MailIcon />

                                <input
                                    id="login-email"
                                    name="email"
                                    type="email"
                                    placeholder="you@university.edu"
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                />
                            </div>

                            {emailError && (
                                <span className="field-error">
                                    <AlertIcon />
                                    {emailError}
                                </span>
                            )}

                        </div>

                        {/* Password */}

                        <div className="auth-field">

                            <label htmlFor="login-password">
                                Password
                            </label>

                            <div
                                className={`auth-input-wrapper ${
                                    passwordError ? "has-error" : ""
                                }`}
                            >
                                <LockIcon />

                                <input
                                    id="login-password"
                                    name="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            (previous) => !previous
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    <EyeIcon hidden={showPassword} />
                                </button>

                            </div>

                            {passwordError && (
                                <span className="field-error">
                                    <AlertIcon />
                                    {passwordError}
                                </span>
                            )}

                        </div>

                        {/* Remember / Forgot */}

                        <div className="login-options">

                            <label className="remember-option">

                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(event) =>
                                        setRememberMe(
                                            event.target.checked
                                        )
                                    }
                                />

                                <span className="custom-checkbox">
                                    ✓
                                </span>

                                <span>
                                    Remember this session
                                </span>

                            </label>

                            <button
                                type="button"
                                className="forgot-password"
                            >
                                Forgot password?
                            </button>

                        </div>

                        {/* Submit */}

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <SpinnerIcon />
                                    Signing in...
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </button>

                    </form>

                    <div className="auth-switch">
                        <span>
                            New to AI Study Companion?
                        </span>

                        <Link to="/register">
                            Create account
                        </Link>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default Login;
