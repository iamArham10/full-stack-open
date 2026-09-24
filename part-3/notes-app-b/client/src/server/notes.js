import api from "./axios";

async function getNotes() {
    const response = await api.get("");
    return response.data;
}

async function addNote({ content, important }) {
    const response = await api.post("", {
        id: 124141,
        content: content,
        important: important,
    });
    return response.status;
}

export { getNotes, addNote };
