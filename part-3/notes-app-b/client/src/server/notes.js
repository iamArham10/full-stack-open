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

async function deleteNote(idOrObj) {
    const id =
        typeof idOrObj === "object" && idOrObj !== null
            ? idOrObj.id
            : idOrObj;
    const response = await api.delete(`/${id}`);
    return response.data;
}

async function updateNote(id, updatedNote) {
    const response = await api.put(`/${id}`, updatedNote);
    return response.data;
}

export { getNotes, addNote, deleteNote, updateNote };
