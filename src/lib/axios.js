import axios from "axios";
import { getExternalSignOut } from "@/contexts/AuthContext";
import { toast } from "sonner";

const instance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

const handleSignOut = (msg) => {
  toast.error(msg);
  console.log(msg);
  const signOut = getExternalSignOut();
  if (signOut) signOut();
};

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const message = error.response?.data?.message;
    const status = error.response?.status;

    const isUnauthorized = status === 401;
    const isTokenExpired = message === "Token expired";
    const isNoAccessToken = message === "No access token";
    const isInvalidToken = message === "Invalid token";

    // Detect if this was the silent auth check
    const isAuthCheck = originalRequest?.url?.includes("/user/me");

    // --- Refresh flow ---
    if (isUnauthorized && isTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await instance.post("/auth/refresh-token");
        return instance(originalRequest);
      } catch (refreshError) {
        if (!isAuthCheck) {
          handleSignOut("Your session has expired. Please sign in again.");
        }
        return Promise.reject(refreshError);
      }
    }

    // --- Direct logout ---
    if (isUnauthorized && (isNoAccessToken || isInvalidToken)) {
      if (!isAuthCheck) {
        handleSignOut("Please sign in to continue.");
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
