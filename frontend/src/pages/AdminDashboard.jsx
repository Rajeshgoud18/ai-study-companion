import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
    getAdminOverview,
    getAdminUsers,
    getAdminUserActivity,
    getAdminUserProjects,
    getAdminProjectDetails,
    getAIUsage,
    getAIUsageByModel,
} from "../services/adminService.js";
import "./AdminDashboard.css";

function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [overview, setOverview] = useState(null);
    const [users, setUsers] = useState([]);
    const [aiUsage, setAIUsage] = useState(null);
    const [modelUsage, setModelUsage] = useState([]);

    const [selectedUser, setSelectedUser] = useState(null);
    const [userProjects, setUserProjects] = useState([]);
    const [userActivity, setUserActivity] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);

    const [search, setSearch] = useState("");
    const [activeSection, setActiveSection] = useState("overview");
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (user?.role !== "ADMIN") {
            navigate("/home", { replace: true });
            return;
        }

        loadDashboard();
    }, [user]);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const [overviewData, usersData, usageData, modelsData] =
                await Promise.all([
                    getAdminOverview(),
                    getAdminUsers(),
                    getAIUsage(),
                    getAIUsageByModel(),
                ]);

            setOverview(overviewData);
            setUsers(usersData || []);
            setAIUsage(usageData);
            setModelUsage(modelsData || []);
        } catch (err) {
            console.error("Failed to load admin dashboard:", err);
            setError(
                err?.response?.data?.message ||
                "Unable to load the admin dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = useMemo(() => {
        const value = search.trim().toLowerCase();

        if (!value) return users;

        return users.filter((item) =>
            [item.name, item.email, item.role]
                .filter(Boolean)
                .some((field) => String(field).toLowerCase().includes(value))
        );
    }, [users, search]);

    const formatNumber = (value) =>
        Number(value || 0).toLocaleString("en-IN");

    const formatTokens = (value) => {
        const number = Number(value || 0);

        if (number >= 1_000_000) {
            return `${(number / 1_000_000).toFixed(2)}M`;
        }

        if (number >= 1_000) {
            return `${(number / 1_000).toFixed(1)}K`;
        }

        return formatNumber(number);
    };

    const formatCost = (value) =>
        `$${Number(value || 0).toFixed(4)}`;

    const formatDate = (value) => {
        if (!value) return "—";

        return new Date(value).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const selectUser = async (item) => {
        try {
            setSelectedUser(item);
            setSelectedProject(null);
            setDetailLoading(true);

            const [projects, activity] = await Promise.all([
                getAdminUserProjects(item.id),
                getAdminUserActivity(item.id),
            ]);

            setUserProjects(projects || []);
            setUserActivity(activity || []);
        } catch (err) {
            console.error("Failed to load user details:", err);
            setError("Unable to load user details.");
            setUserProjects([]);
            setUserActivity([]);
        } finally {
            setDetailLoading(false);
        }
    };

    const selectProject = async (projectId) => {
        try {
            setDetailLoading(true);
            const project = await getAdminProjectDetails(projectId);
            setSelectedProject(project);
        } catch (err) {
            console.error("Failed to load project details:", err);
            setError("Unable to load project details.");
        } finally {
            setDetailLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (user?.role !== "ADMIN") return null;

    if (loading) {
        return (
            <div className="admin-loading-page">
                <div className="admin-spinner" />
                <h2>Loading admin dashboard...</h2>
                <p>Preparing platform statistics and AI usage.</p>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <div className="admin-brand-icon">✦</div>
                    <div>
                        <strong>AI Study Companion</strong>
                        <span>Admin Console</span>
                    </div>
                </div>

                <div className="admin-sidebar-section">
                    <span className="admin-sidebar-label">ADMIN</span>

                    <button
                        className={`admin-nav-item ${activeSection === "overview" ? "active" : ""}`}
                        onClick={() => setActiveSection("overview")}
                    >
                        <span>⌂</span>
                        Overview
                    </button>

                    <button
                        className={`admin-nav-item ${activeSection === "users" ? "active" : ""}`}
                        onClick={() => setActiveSection("users")}
                    >
                        <span>◉</span>
                        Users
                    </button>

                    <button
                        className={`admin-nav-item ${activeSection === "ai" ? "active" : ""}`}
                        onClick={() => setActiveSection("ai")}
                    >
                        <span>✦</span>
                        AI Usage
                    </button>
                </div>

                <div className="admin-sidebar-section admin-sidebar-lower">
                    <button
                        className="admin-nav-item"
                        onClick={loadDashboard}
                    >
                        <span>↻</span>
                        Refresh data
                    </button>
                </div>

                <div className="admin-user-card">
                    <div className="admin-avatar">
                        {(user?.name || "A").charAt(0).toUpperCase()}
                    </div>
                    <div className="admin-user-info">
                        <strong>{user?.name || "Admin"}</strong>
                        <span>Administrator</span>
                    </div>
                    <button
                        className="admin-logout"
                        onClick={handleLogout}
                        title="Logout"
                    >
                        ↪
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-topbar">
                    <div className="admin-breadcrumbs">
                        <strong>Admin</strong>
                        <span>/</span>
                        <strong>Dashboard</strong>
                    </div>

                    <div className="admin-topbar-actions">


                        <button className="admin-icon-button" onClick={loadDashboard}>
                            ↻
                        </button>
                    </div>
                </header>

                <div className="admin-content">
                    <div className="admin-page-header">
                        <div>
                            <div className="admin-eyebrow">ADMIN CONSOLE</div>
                            <h1>Platform overview</h1>
                            <p>
                                Monitor users, learning activity, projects, and AI usage
                                across the study companion.
                            </p>
                        </div>
                        <div className="admin-role-badge">ADMIN</div>
                    </div>

                    {error && (
                        <div className="admin-error">
                            <span>!</span>
                            {error}
                        </div>
                    )}

                    {activeSection === "overview" && (
                        <>
                            <section className="admin-stat-grid">
                                <StatCard
                                    label="TOTAL USERS"
                                    value={formatNumber(overview?.totalUsers)}
                                    icon="◉"
                                />
                                <StatCard
                                    label="TOTAL SPACES"
                                    value={formatNumber(overview?.totalSpaces)}
                                    icon="▦"
                                />
                                <StatCard
                                    label="TOTAL PROJECTS"
                                    value={formatNumber(overview?.totalProjects)}
                                    icon="▣"
                                />
                                <StatCard
                                    label="LEARNING EVENTS"
                                    value={formatNumber(overview?.totalLearningEvents)}
                                    icon="↗"
                                />
                            </section>

                            <section className="admin-two-column">
                                <div className="admin-panel">
                                    <PanelHeader
                                        eyebrow="USERS"
                                        title="Recent users"
                                        action={() => setActiveSection("users")}
                                        actionText="View all"
                                    />
                                    <UserTable
                                        users={filteredUsers.slice(0, 6)}
                                        onSelect={selectUser}
                                    />
                                </div>

                                <AIUsagePanel
                                    usage={aiUsage}
                                    models={modelUsage}
                                    formatTokens={formatTokens}
                                    formatCost={formatCost}
                                    compact
                                />
                            </section>
                        </>
                    )}

                    {activeSection === "users" && (
                        <section className="admin-panel admin-users-panel">
                            <PanelHeader
                                eyebrow="PLATFORM USERS"
                                title={`${filteredUsers.length} users`}
                            />
                            <UserTable
                                users={filteredUsers}
                                onSelect={selectUser}
                                emptyText="No users match your search."
                            />
                        </section>
                    )}

                    {activeSection === "ai" && (
                        <AIUsagePanel
                            usage={aiUsage}
                            models={modelUsage}
                            formatTokens={formatTokens}
                            formatCost={formatCost}
                        />
                    )}

                    {selectedUser && (
                        <section className="admin-detail-grid">
                            <div className="admin-panel">
                                <PanelHeader
                                    eyebrow="USER DETAILS"
                                    title={selectedUser.name}
                                    action={() => setSelectedUser(null)}
                                    actionText="Close"
                                />

                                <div className="user-detail-header">
                                    <div className="large-avatar">
                                        {selectedUser.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3>{selectedUser.name}</h3>
                                        <p>{selectedUser.email}</p>
                                        <span className="role-badge">{selectedUser.role}</span>
                                    </div>
                                </div>

                                <div className="detail-section">
                                    <div className="detail-section-title">PROJECTS</div>
                                    {userProjects.length === 0 ? (
                                        <div className="admin-empty-small">No projects found.</div>
                                    ) : (
                                        <div className="project-list">
                                            {userProjects.map((project) => (
                                                <button
                                                    key={project.id}
                                                    className="admin-project-row"
                                                    onClick={() => selectProject(project.id)}
                                                >
                                                    <div className="project-icon">▣</div>
                                                    <div>
                                                        <strong>{project.name}</strong>
                                                        <span>{project.spaceName}</span>
                                                    </div>
                                                    <span>→</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="admin-panel">
                                <PanelHeader
                                    eyebrow="ACTIVITY"
                                    title="Learning activity"
                                />
                                <div className="activity-list">
                                    {userActivity.length === 0 ? (
                                        <div className="admin-empty-small">No activity found.</div>
                                    ) : (
                                        userActivity.slice(0, 10).map((activity) => (
                                            <div className="activity-row" key={activity.id}>
                                                <div className="activity-dot" />
                                                <div className="activity-body">
                                                    <strong>{activity.eventType}</strong>
                                                    <span>
                                                        Project #{activity.projectId} · {formatDate(activity.createdAt)}
                                                    </span>
                                                    {activity.metadata && (
                                                        <small>{activity.metadata}</small>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    {selectedProject && (
                        <section className="admin-project-detail admin-panel">
                            <PanelHeader
                                eyebrow="PROJECT DETAILS"
                                title={selectedProject.projectName}
                                action={() => setSelectedProject(null)}
                                actionText="Close"
                            />
                            <div className="project-detail-grid">
                                <DetailItem label="Project ID" value={selectedProject.projectId} />
                                <DetailItem label="Space" value={`${selectedProject.spaceName} (#${selectedProject.spaceId})`} />
                                <DetailItem label="Owner" value={selectedProject.userName} />
                                <DetailItem label="Email" value={selectedProject.userEmail} />
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}

function StatCard({ label, value, icon }) {
    return (
        <div className="admin-stat-card">
            <div className="stat-card-top">
                <span>{label}</span>
                <div className="stat-icon">{icon}</div>
            </div>
            <strong>{value}</strong>
        </div>
    );
}

function PanelHeader({ eyebrow, title, action, actionText }) {
    return (
        <div className="admin-panel-header">
            <div>
                <div className="admin-section-eyebrow">{eyebrow}</div>
                <h2>{title}</h2>
            </div>
            {action && (
                <button className="panel-action" onClick={action}>
                    {actionText}
                </button>
            )}
        </div>
    );
}

function UserTable({ users, onSelect, emptyText = "No users found." }) {
    if (!users.length) {
        return <div className="admin-empty">{emptyText}</div>;
    }

    return (
        <div className="admin-table-wrap">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Role</th>
                        <th>ID</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((item) => (
                        <tr key={item.id}>
                            <td>
                                <div className="table-user">
                                    <div className="table-avatar">
                                        {item.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <strong>{item.name}</strong>
                                        <span>{item.email}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span className={`role-badge ${item.role === "ADMIN" ? "admin" : ""}`}>
                                    {item.role}
                                </span>
                            </td>
                            <td className="muted-cell">#{item.id}</td>
                            <td>
                                <button
                                    className="view-button"
                                    onClick={() => onSelect(item)}
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function AIUsagePanel({ usage, models, formatTokens, formatCost, compact = false }) {
    return (
        <section className={`admin-panel ai-panel ${compact ? "compact" : ""}`}>
            <PanelHeader eyebrow="AI USAGE" title="Model consumption" />

            <div className="ai-stat-grid">
                <div>
                    <span>REQUESTS</span>
                    <strong>{Number(usage?.totalRequests || 0).toLocaleString("en-IN")}</strong>
                </div>
                <div>
                    <span>TOTAL TOKENS</span>
                    <strong>{formatTokens(usage?.totalTokens)}</strong>
                </div>
                <div>
                    <span>ESTIMATED COST</span>
                    <strong>{formatCost(usage?.estimatedCost)}</strong>
                </div>
            </div>

            <div className="model-table-wrap">
                <div className="model-table-head">
                    <span>MODEL</span>
                    <span>REQUESTS</span>
                    <span>TOKENS</span>
                    <span>COST</span>
                </div>

                {models.length === 0 ? (
                    <div className="admin-empty-small">No AI usage recorded yet.</div>
                ) : (
                    models.map((model) => (
                        <div className="model-table-row" key={`${model.provider}-${model.model}`}>
                            <div>
                                <strong>{model.model}</strong>
                                <span>{model.provider}</span>
                            </div>
                            <span>{Number(model.requests || 0).toLocaleString("en-IN")}</span>
                            <span>{formatTokens(model.totalTokens)}</span>
                            <span>{formatCost(model.estimatedCost)}</span>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}

function DetailItem({ label, value }) {
    return (
        <div className="detail-item">
            <span>{label}</span>
            <strong>{value || "—"}</strong>
        </div>
    );
}

export default AdminDashboard;
