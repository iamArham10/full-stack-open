import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
    token = `Bearer ${newToken}`;
};

const createBlog = async ({ title, author, url }) => {
    const config = {
        headers: { Authorization: token },
    };

    const response = await axios.post(baseUrl, { title, author, url }, config);
    return response.data;
};

const getAll = async () => {
    const response = await axios.get(baseUrl);
    return response.data;
};

export default { getAll, createBlog, setToken };

