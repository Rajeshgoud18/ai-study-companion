import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getHomePath, normalizeRole } from "../utils/roles.js";

// Usage:
//   <ProtectedRoute><Home /></ProtectedRoute>                      any logged-in user
//   <ProtectedRoute roles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>
function ProtectedRoute({ children, roles }) {
    const { user } = useAuth();

    // Not logged in -> login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Logged in but wrong role -> send to their own home
    if (roles && !roles.map(normalizeRole).includes(normalizeRole(user.role))) {
        return <Navigate to={getHomePath(user)} replace />;
    }

    return children;
}

export default ProtectedRoute;