import api from "./api.js";

export const getAdminOverview = async () => {
    const response = await api.get("/admin/overview");
    return response.data;
};

export const getAdminUsers = async () => {
    const response = await api.get("/admin/users");
    return response.data;
};

export const getAdminUserActivity = async (userId) => {
    const response = await api.get(`/admin/users/${userId}/activity`);
    return response.data;
};

export const getAdminUserProjects = async (userId) => {
    const response = await api.get(`/admin/users/${userId}/projects`);
    return response.data;
};

export const getAdminProjectDetails = async (projectId) => {
    const response = await api.get(`/admin/projects/${projectId}`);
    return response.data;
};

export const getAIUsage = async () => {
    const response = await api.get("/admin/ai/usage");
    return response.data;
};

export const getAIUsageByModel = async () => {
    const response = await api.get("/admin/ai/models");
    return response.data;
};
