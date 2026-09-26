import axios from "axios";

const baseUrl = "/notes";

const api = axios.create({
    baseURL: baseUrl,
});

export default api;
