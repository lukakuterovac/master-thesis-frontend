import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const AuthContext = createContext(null);

// Provider component to wrap your app
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  // Example: check localStorage for token on mount and set user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // You could decode token or call backend to validate & fetch user data
      setToken({ token });
    }
  }, []);

  // Sign in function (just example)
  const signIn = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  // Sign out function
  const signOut = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token: token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to consume auth context
export function useAuth() {
  return useContext(AuthContext);
}
