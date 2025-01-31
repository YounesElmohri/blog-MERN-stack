import axios from "axios";

const request = axios.create({
    baseURL: "https://blog-mern-stack-backend.onrender.com"
});

export default request;
