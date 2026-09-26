import api from "./axios";

async function getNotes() {
    const response = await api.get("");
    return response.data;
}

async function addNote({ content, important }) {
    const response = await api.post("", {
        content: content,
        important: important,
    });
    return response.data;
}

async function deleteNote({ id }) {
    const response = await api.delete(`/${id}`);
    return response.data;
}

export { getNotes, addNote, deleteNote };
