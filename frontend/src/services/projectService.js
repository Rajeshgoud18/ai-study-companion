import api from "./api";

export const getProjects = async (spaceId) => {
    const response = await api.get(`/spaces/${spaceId}/projects`);
    return response.data;
};

export const getProject = async (projectId) => {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
};

export const createProject = async (
    spaceId,
    name,
    description,
    learningGoal
) => {
    const response = await api.post(
        `/spaces/${spaceId}/projects`,
        {
            name,
            description,
            learningGoal
        }
    );

    return response.data;
};