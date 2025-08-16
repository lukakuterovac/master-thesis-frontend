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

    // Handle auth errors
    if (status === 401) {
      error.isAuthError = true; // <-- mark this as an auth error

      if (message === "Token expired") {
        toast.error("Session expired, please sign in again.");
      } else {
        toast.error("Unauthorized. Please sign in.");
      }

      // Clear local storage/session
      localStorage.removeItem("token");

      // Navigate to sign-in page
      const navigate = getNavigate();
      if (navigate) {
        setTimeout(() => navigate("/sign-in"), 100);
      } else {
        setTimeout(() => {
          window.location.href = "/sign-in";
        }, 100);
      }
    }
    // Handle forbidden
    else if (status === 403) {
      toast.error("You don’t have permission to perform this action.");
    }
    // Handle server errors
    else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    }
    // Handle network errors
    else if (error.code === "ECONNABORTED" || !error.response) {
      toast.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export default instance;
