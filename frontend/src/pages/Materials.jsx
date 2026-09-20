import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getProject } from "../services/projectService.js";
import {
    getMaterials,
    uploadMaterial,
    deleteMaterial
} from "../services/materialService.js";

import "./Materials.css";

function Materials() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const fileInputRef = useRef(null);

    const [project, setProject] = useState(null);
    const [materials, setMaterials] = useState([]);

    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [materialsLoading, setMaterialsLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const [error, setError] = useState("");
    const [dragActive, setDragActive] = useState(false);

    const userName =
        localStorage.getItem("name") || "Learner";

    // ================================
    // LOAD PROJECT
    // ================================

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

    // ================================
    // LOAD MATERIALS
    // ================================

    useEffect(() => {
        let intervalId;

        const loadMaterials = async () => {
            try {
                const data =
                    await getMaterials(projectId);

                setMaterials(data);

                const processing = data.some(
                    (material) =>
                        material.status === "QUEUED" ||
                        material.status === "PROCESSING"
                );

                if (!processing && intervalId) {
                    clearInterval(intervalId);
                }
            } catch (error) {
                console.error(
                    "Failed to load materials:",
                    error
                );

                setError(
                    "Unable to load learning materials."
                );
            } finally {
                setMaterialsLoading(false);
            }
        };

        loadMaterials();

        intervalId = setInterval(
            loadMaterials,
            3000
        );

        return () => {
            clearInterval(intervalId);
        };
    }, [projectId]);

    // ================================
    // FILE SELECTION
    // ================================

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (file.type !== "application/pdf") {
            setError("Only PDF files are supported.");
            return;
        }

        setError("");
        setSelectedFile(file);
    };

    const handleDrop = (event) => {
        event.preventDefault();

        setDragActive(false);

        const file = event.dataTransfer.files?.[0];

        if (!file) {
            return;
        }

        if (file.type !== "application/pdf") {
            setError("Only PDF files are supported.");
            return;
        }

        setError("");
        setSelectedFile(file);
    };

    // ================================
    // UPLOAD
    // ================================

    const handleUpload = async () => {
        if (!selectedFile) {
            setError("Please select a PDF file first.");
            return;
        }

        try {
            setUploading(true);
            setError("");

            await uploadMaterial(
                projectId,
                selectedFile
            );

            setSelectedFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            const data =
                await getMaterials(projectId);

            setMaterials(data);

        } catch (error) {
            console.error(
                "Failed to upload material:",
                error
            );

            setError(
                "Unable to upload the material."
            );
        } finally {
            setUploading(false);
        }
    };

    // ================================
    // DELETE
    // ================================

    const handleDelete = async (materialId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this material?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await deleteMaterial(
                projectId,
                materialId
            );

            setMaterials((current) =>
                current.filter(
                    (material) =>
                        material.id !== materialId
                )
            );

        } catch (error) {
            console.error(
                "Failed to delete material:",
                error
            );

            setError(
                "Unable to delete the material."
            );
        }
    };

    // ================================
    // SIDEBAR NAVIGATION
    // ================================

    const goTo = (page) => {
        navigate(
            `/project/${projectId}/${page}`
        );
    };

    // ================================
    // HELPERS
    // ================================

    const formatFileSize = (bytes) => {
        if (!bytes) {
            return "—";
        }

        if (bytes < 1024) {
            return `${bytes} B`;
        }

        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }

        return `${(
            bytes /
            (1024 * 1024)
        ).toFixed(1)} MB`;
    };

    const formatStatus = (status) => {
        if (!status) {
            return "Unknown";
        }

        return (
            status.charAt(0) +
            status.slice(1).toLowerCase()
        );
    };

    // ================================
    // LOADING
    // ================================

    if (loading) {
        return (
            <div className="materials-loading-page">
                <div className="materials-spinner"></div>

                <h2>
                    Loading materials...
                </h2>

                <p>
                    Preparing your learning workspace
                </p>
            </div>
        );
    }

    // ================================
    // PAGE
    // ================================

    return (
        <div className="materials-page">

            {/* =================================
                SIDEBAR
            ================================= */}

            <aside className="materials-sidebar">

                {/* BRAND */}

                <div className="materials-brand">

                    <div className="materials-brand-icon">
                        ✦
                    </div>

                    <div>
                        <div className="materials-brand-name">
                            AI Study Companion
                        </div>

                        <div className="materials-brand-subtitle">
                            Learn smarter
                        </div>
                    </div>

                </div>

                {/* WORKSPACE */}

                <div className="sidebar-section">

                    <div className="sidebar-section-label">
                        WORKSPACE
                    </div>

                    <button
                        className="sidebar-item"
                        onClick={() =>
                            navigate("/home")
                        }
                    >
                        <span>⌂</span>
                        Home
                    </button>

                    <button
                        className="sidebar-item"
                        onClick={() =>
                            navigate("/spaces")
                        }
                    >
                        <span>▱</span>
                        Spaces
                    </button>

                    <button
                        className="sidebar-item"
                        onClick={() =>
                            navigate("/projects")
                        }
                    >
                        <span>◫</span>
                        Projects
                    </button>


                </div>

                {/* CURRENT PROJECT */}

                <div className="sidebar-section project-section">

                    <div className="sidebar-section-label">
                        CURRENT PROJECT
                    </div>

                    {project && (
                        <div className="project-card">

                            <div className="project-icon">
                                ✦
                            </div>

                            <div className="project-info">

                                <strong>
                                    {project.name}
                                </strong>

                                <span>
                                    {project.description ||
                                        "Learning project"}
                                </span>

                            </div>

                            <span className="project-arrow">
                                ›
                            </span>

                        </div>
                    )}

                </div>

                {/* PROJECT NAVIGATION */}

                <nav className="project-navigation">

 
                    <button
                        className="project-nav-item active"
                        onClick={() =>
                            goTo("materials")
                        }
                    >
                        <span>▤</span>
                        Materials
                    </button>

                    <button
                        className="project-nav-item"
                        onClick={() =>
                            goTo("knowledge")
                        }
                    >
                        <span>◇</span>
                        Knowledge
                    </button>

                    <button
                        className="project-nav-item"
                        onClick={() =>
                            goTo("tutor")
                        }
                    >
                        <span>✦</span>
                        AI Tutor
                    </button>

                    <button
                        className="project-nav-item"
                        onClick={() =>
                            goTo("quiz")
                        }
                    >
                        <span>✓</span>
                        Quiz
                    </button>

                    <button
                        className="project-nav-item"
                        onClick={() =>
                            goTo("assessment")
                        }
                    >
                        <span>◇</span>
                        Assessment
                    </button>

                    <button
                        className="project-nav-item"
                        onClick={() =>
                            goTo("mastery")
                        }
                    >
                        <span>◉</span>
                        Mastery
                    </button>

                    <button
                        className="project-nav-item"
                        onClick={() =>
                            goTo("growth")
                        }
                    >
                        <span>↗</span>
                        Growth
                    </button>

                    <button
                        className="project-nav-item"
                        onClick={() =>
                            goTo("analytics")
                        }
                    >
                        <span>⌁</span>
                        Analytics
                    </button>

                </nav>

                {/* BOTTOM */}

                <div className="sidebar-bottom">

                    <button className="sidebar-bottom-item">
                        ?
                        <span>Help</span>
                    </button>

                    <button className="sidebar-bottom-item">
                        ⚙
                        <span>Settings</span>
                    </button>

                    <div className="sidebar-user">

                        <div className="user-avatar">
                            {userName
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div className="user-info">

                            <strong>
                                {userName}
                            </strong>

                            <span>
                                Learner
                            </span>

                        </div>

                        <span className="user-menu">
                            ...
                        </span>

                    </div>

                </div>

            </aside>

            {/* =================================
                MAIN CONTENT
            ================================= */}

            <main className="materials-main">

                {/* TOPBAR */}

                <header className="materials-topbar">

                    <div className="breadcrumbs">

                        <button
                            onClick={() =>
                                navigate("/home")
                            }
                        >
                            Home
                        </button>

                        <span>—</span>

                        <button
                            onClick={() =>
                                navigate(
                                    `/project/${projectId}`
                                )
                            }
                        >
                            {project?.name ||
                                "Project"}
                        </button>

                        <span>—</span>

                        <strong>
                            Materials
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

                <div className="materials-content">

                    <div className="page-header">

                        <div>

                            <div className="page-eyebrow">
                                KNOWLEDGE BASE
                            </div>

                            <h1>
                                Learning Materials
                            </h1>

                            <p>
                                Upload and manage the
                                materials your AI Tutor
                                uses to understand this
                                project.
                            </p>

                        </div>

                        <button
                            className="upload-button"
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                        >
                            + Upload Material
                        </button>

                    </div>

                    {/* ERROR */}

                    {error && (
                        <div className="materials-error">
                            <span>!</span>
                            {error}
                        </div>
                    )}

                    {/* UPLOAD AREA */}

                    <section className="upload-card">

                        <div
                            className={
                                dragActive
                                    ? "drop-zone drag-active"
                                    : "drop-zone"
                            }
                            onDragOver={(event) => {
                                event.preventDefault();
                                setDragActive(true);
                            }}
                            onDragLeave={() =>
                                setDragActive(false)
                            }
                            onDrop={handleDrop}
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                        >

                            <div className="upload-icon">
                                ↑
                            </div>

                            <h2>
                                {selectedFile
                                    ? selectedFile.name
                                    : "Drop your PDF here"}
                            </h2>

                            <p>
                                {selectedFile
                                    ? `${formatFileSize(
                                          selectedFile.size
                                      )} · PDF`
                                    : "or browse files from your computer"}
                            </p>

                            <span className="supported-format">
                                Supported format: PDF
                            </span>

                            <input
                                ref={fileInputRef}
                                id="material-upload"
                                type="file"
                                accept="application/pdf,.pdf"
                                onChange={handleFileChange}
                                hidden
                            />

                        </div>

                        {selectedFile && (
                            <div className="upload-actions">

                                <button
                                    className="secondary-button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setSelectedFile(null);

                                        if (
                                            fileInputRef.current
                                        ) {
                                            fileInputRef.current.value =
                                                "";
                                        }
                                    }}
                                >
                                    Remove
                                </button>

                                <button
                                    className="primary-button"
                                    onClick={handleUpload}
                                    disabled={uploading}
                                >
                                    {uploading
                                        ? "Uploading..."
                                        : "Upload Material →"}
                                </button>

                            </div>
                        )}

                    </section>

                    {/* MATERIAL LIST */}

                    <section className="materials-section">

                        <div className="section-header">

                            <div>

                                <div className="section-eyebrow">
                                    YOUR MATERIALS
                                </div>

                                <h2>
                                    Project documents
                                </h2>

                            </div>

                            <span className="material-count">
                                {materials.length}{" "}
                                {materials.length === 1
                                    ? "document"
                                    : "documents"}
                            </span>

                        </div>

                        {materialsLoading ? (

                            <div className="materials-empty">
                                <div className="materials-spinner"></div>

                                <p>
                                    Loading your materials...
                                </p>
                            </div>

                        ) : materials.length === 0 ? (

                            <div className="materials-empty">

                                <div className="empty-icon">
                                    ▤
                                </div>

                                <h3>
                                    No materials yet
                                </h3>

                                <p>
                                    Upload your first PDF
                                    to start building your
                                    project knowledge base.
                                </p>

                                <button
                                    className="primary-button"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    Upload your first PDF
                                </button>

                            </div>

                        ) : (

                            <div className="material-list">

                                {materials.map(
                                    (material) => (

                                        <div
                                            className="material-row"
                                            key={material.id}
                                        >

                                            <div className="file-icon">
                                                PDF
                                            </div>

                                            <div className="material-details">

                                                <strong>
                                                    {material.fileName ||
                                                        material.name ||
                                                        "Untitled PDF"}
                                                </strong>

                                                <span>
                                                    {formatFileSize(
                                                        material.fileSize
                                                    )}
                                                    {" · "}
                                                    PDF
                                                </span>

                                            </div>

                                            <div className="material-status">

                                                <span
                                                    className={`status-badge ${String(
                                                        material.status ||
                                                            ""
                                                    ).toLowerCase()}`}
                                                >
                                                    <span className="status-dot"></span>

                                                    {formatStatus(
                                                        material.status
                                                    )}
                                                </span>

                                            </div>

                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    handleDelete(
                                                        material.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </section>

                </div>

            </main>

        </div>
    );
}

export default Materials;