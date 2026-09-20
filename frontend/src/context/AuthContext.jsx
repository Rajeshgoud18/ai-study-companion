import { createContext, useContext, useState } from "react";
import { login as loginUser, logout as logoutUser } from "../services/authService";
import { normalizeRole } from "../utils/roles";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    // Restore the session on page refresh
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            return null;
        }

        return {
            userId: localStorage.getItem("userId"),
            name: localStorage.getItem("name"),
            email: localStorage.getItem("email"),
            role: normalizeRole(localStorage.getItem("role")),
        };
    });

    const login = async (credentials) => {
        const data = await loginUser(credentials);

        const loggedInUser = {
            userId: data.userId,
            name: data.name,
            email: data.email,
            role: normalizeRole(data.role),
        };

        setUser(loggedInUser);

        return loggedInUser; // lets the Login page redirect immediately
    };

    const logout = () => {
        logoutUser();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside <AuthProvider>");
    }

    return context;
};