import axios from "axios";
import { getNavigate } from "./helpers";
import { toast } from "sonner";

const instance = axios.create({
  baseURL: import.meta.env.API_BASE_URL || "http://localhost:3000/api",
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401 && message === "Token expired") {
      toast.error("Session expired, please sign in again.");

      // Remove token so user stays logged out
      localStorage.removeItem("token");

      const navigate = getNavigate();
      if (navigate) {
        setTimeout(() => navigate("/sign-in"), 100);
      } else {
        setTimeout(() => {
          window.location.href = "/sign-in";
        }, 100);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
