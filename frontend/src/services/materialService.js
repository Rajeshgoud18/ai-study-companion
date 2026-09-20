import api from "./api";

export const getMaterials = async (projectId) => {
    const response = await api.get(
        `/projects/${projectId}/materials`
    );

    return response.data;
};

export const uploadMaterial = async (projectId, file) => {

    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(
        `/projects/${projectId}/materials`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const deleteMaterial = async (projectId, materialId) => {
    await api.delete(
        `/projects/${projectId}/materials/${materialId}`
    );
};