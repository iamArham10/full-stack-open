import { api } from "./axios";

async function getPhoneBook() {
    const response = await api.get("");
    return response.data;
}

async function getPhone(id) {
    if (id === undefined) {
        return getPhoneBook();
    }
    const response = await api.get(`/${id}`);
    return response.data;
}

async function createPhone(newObject) {
    const response = await api.post("", newObject);
    return response.data;
}

async function updatePhone(id, newObject) {
    const response = await api.put(`/${id}`, newObject);
    return response.data;
}

async function deletePhone(id) {
    const response = await api.delete(`/${id}`);
    return response.data;
}

export {
    createPhone,
    deletePhone,
    getPhone,
    getPhoneBook,
    updatePhone,
};

export default {
    getPhone,
    getPhoneBook,
    createPhone,
    updatePhone,
    deletePhone,
};
