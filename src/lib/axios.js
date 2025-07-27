import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.API_BASE_URL || "http://localhost:3000/api",
  withCredentials: true,
});

export default instance;
