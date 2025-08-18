import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "@/lib/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const res = await axios.get("/user/me");
      console.log("Check auth", res.data);
      setUser(res.data.user);
    } catch (error) {
      console.log("Error while checkAuth", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const signIn = useCallback(async (credentials) => {
    try {
      const res = await axios.post("/auth/sign-in", credentials);
      setUser(res.data.user);
    } catch (err) {
      console.error("Sign-in failed:", err);
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    await axios.post("/auth/sign-out");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
