import api from "./api";

export const getUserSpaces = async () => {
    const response = await api.get("/spaces");
    return response.data;
};

export const createSpace = async (name) => {
    const response = await api.post("/spaces", {
        name
    });

    return response.data;
};