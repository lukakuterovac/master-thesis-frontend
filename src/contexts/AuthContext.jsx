import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const AuthContext = createContext(null);

// Provider component to wrap your app
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Example: check localStorage for token on mount and set user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token); // Assuming raw token is enough; otherwise decode or fetch user
    } else {
      setToken(null);
    }
    setLoading(false); // <- Done checking
  }, []);

  // Sign in function (just example)
  const signIn = (user, token) => {
    localStorage.setItem("token", token);
    setUser(user);
    setToken(token);
  };

  // Sign out function
  const signOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user: user, token: token, signIn, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to consume auth context
export function useAuth() {
  return useContext(AuthContext);
}
