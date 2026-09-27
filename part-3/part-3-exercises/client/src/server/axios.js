import axios from "axios";

const baseUrl = "/phone";

export const api = axios.create({
    baseURL: baseUrl,
});

export default api;
