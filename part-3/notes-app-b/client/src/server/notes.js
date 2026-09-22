import api from "./axios";

async function getNotes() {
    const response = await api.get("");
    return response.data;
}

export { getNotes };
