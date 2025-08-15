import { useEffect } from "react";
import AppRouter from "./router";

import { useNavigate } from "react-router-dom";
import { setNavigate, setSignOut } from "@/lib/helpers";
import { useAuth } from "@/contexts/AuthContext";

function App() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    setNavigate(navigate);
    setSignOut(signOut);
  }, [navigate, signOut]);

  return <AppRouter />;
}

export default App;
