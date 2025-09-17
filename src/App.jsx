import { useEffect } from "react";
import AppRouter from "./router";

import { useNavigate } from "react-router-dom";
import { setNavigate, setSignOut } from "@/lib/helpers";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Toaster } from "sonner";

function App() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    setNavigate(navigate);
    setSignOut(signOut);
  }, [navigate, signOut]);

  return (
    <>
      <Toaster position="bottom-center" theme={theme} richColors={true} />
      <AppRouter />
    </>
  );
}

export default App;
