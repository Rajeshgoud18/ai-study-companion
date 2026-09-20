import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ProjectWorkspace from "./pages/ProjectWorkspace.jsx";
import AITutor from "./pages/AITutor.jsx";
import Materials from "./pages/Materials.jsx";
import Knowledge from "./pages/Knowledge.jsx";
import Quiz from "./pages/Quiz.jsx";
import Growth from "./pages/Growth.jsx";
import Mastery from "./pages/Mastery.jsx";
import Assessment from "./pages/Assessment.jsx";
import ProjectAnalytics from "./pages/ProjectAnalytics.jsx";
import Spaces from "./pages/Spaces.jsx";
import Projects from "./pages/Projects.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Landing />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/project/:projectId"
                    element={
                        <ProtectedRoute>
                            <ProjectWorkspace />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute roles={["ADMIN"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

                <Route
                    path="/project/:projectId/tutor"
                    element={
                        <ProtectedRoute>
                            <AITutor />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/project/:projectId/materials"
                    element={
                        <ProtectedRoute>
                            <Materials />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/project/:projectId/knowledge"
                    element={
                        <ProtectedRoute>
                            <Knowledge />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/project/:projectId/quiz"
                    element={
                        <ProtectedRoute>
                            <Quiz />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/project/:projectId/growth"
                    element={
                        <ProtectedRoute>
                            <Growth />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/project/:projectId/mastery"
                    element={
                        <ProtectedRoute>
                            <Mastery />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/project/:projectId/assessment"
                    element={
                        <ProtectedRoute>
                            <Assessment />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/project/:projectId/analytics"
                    element={
                        <ProtectedRoute>
                            <ProjectAnalytics />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/spaces"
                    element={
                        <ProtectedRoute>
                            <Spaces />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/projects"
                    element={
                        <ProtectedRoute>
                            <Projects />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;