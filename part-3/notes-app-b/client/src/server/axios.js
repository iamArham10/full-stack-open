import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/notes",
});

export default api;
