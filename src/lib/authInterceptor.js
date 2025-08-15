import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function setupInterceptors(axiosInstance) {
  const { signOut } = useAuth();

  axiosInstance.interceptors.response.use(
    (res) => res,
    (err) => {
      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 401 && message === "Token expired") {
        signOut();
        toast.error("Session expired, please sign in again.");
        setTimeout(() => {
          window.location.href = "/sign-in";
        }, 100);
      }

      return Promise.reject(err);
    }
  );
}
