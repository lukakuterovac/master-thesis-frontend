import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// Create the context
const AuthContext = createContext(null);

// Provider component to wrap your app
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        if (decoded.exp * 1000 > Date.now()) {
          setToken(storedToken);
          console.log("Decoded: ", decoded);
        } else {
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      } catch {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const signIn = (user, token) => {
    localStorage.setItem("token", token);
    setUser(user);
    setToken(token);
  };

  const signOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to consume auth context
export function useAuth() {
  return useContext(AuthContext);
}
