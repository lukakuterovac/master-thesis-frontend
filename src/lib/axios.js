import axios from "axios";
import { getNavigate } from "./helpers";
import { toast } from "sonner";

const instance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isTokenExpired = error.response?.data?.message === "Token expired";
    const isUnauthorized = error.response?.status === 401;

    // Condition to trigger the refresh token flow
    if (isUnauthorized && isTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await instance.post("/auth/refresh-token");
        return instance(originalRequest);
      } catch (refreshError) {
        // This 'catch' block is for when the refresh token itself is invalid or expired
        toast.error("Your session has expired. Please sign in again.");
        // Mark the error as handled to prevent the component's catch block from running
        refreshError.isHandled = true;

        const navigate = getNavigate();
        if (navigate) {
          setTimeout(() => navigate("/sign-in"), 100);
        } else {
          setTimeout(() => (window.location.href = "/sign-in"), 100);
        }
        // Explicitly return a rejected promise here to stop the flow
        return Promise.reject(refreshError);
      }
    }

    // For any other error (including a non-expired 401), reject the promise
    // This allows the component's catch block to handle it if needed
    return Promise.reject(error);
  }
);

export default instance;
