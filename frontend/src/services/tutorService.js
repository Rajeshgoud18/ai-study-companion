import api from "./api.js";

export const askTutor = async (projectId, question) => {
    const response = await api.post(
        `/ai/tutor?projectId=${projectId}`,
        {
            question
        }
    );

    return response.data;
};