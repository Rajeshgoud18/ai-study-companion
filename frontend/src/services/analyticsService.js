import api from "./api.js";

export const getProjectAnalytics = async (userId, projectId) => {
    const response = await api.get("/analytics/project", {
        params: {
            userId,
            projectId
        }
    });

    return response.data;
};