import axios from "axios";
import { toast } from "sonner";
import { getNavigate } from "./helpers";

const instance = axios.create({
  baseURL: import.meta.env.API_BASE_URL || "http://localhost:3000/api",
  withCredentials: true,
});

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || "Something went wrong";

    console.log("An error has occured: ", error);

    // Handle auth errors
    if (status === 401) {
      error.isAuthError = true;

      if (message === "Token expired") {
        toast.error("Session expired, please sign in again");
      } else {
        toast.error(message);
      }

      localStorage.removeItem("token");

      const navigate = getNavigate();
      if (navigate) {
        setTimeout(() => navigate("/sign-in"), 100);
      } else {
        setTimeout(() => (window.location.href = "/sign-in"), 100);
      }
    }
    // Mark other handled errors
    else if (status >= 500 || status === 403 || !error.response) {
      error.isHandled = true;
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default instance;
