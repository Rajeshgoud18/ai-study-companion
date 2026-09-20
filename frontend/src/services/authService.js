import api from "./api.js";

export const register = async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
};

export const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);

    const data = response.data;

    // Store JWT
    localStorage.setItem("token", data.token);

    // Store useful user information if returned by backend
    if (data.userId) {
        localStorage.setItem("userId", data.userId);
    }

    if (data.role) {
        localStorage.setItem("role", data.role);
    }

    if (data.name) {
        localStorage.setItem("name", data.name);
    }

    return data;
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
};

export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};