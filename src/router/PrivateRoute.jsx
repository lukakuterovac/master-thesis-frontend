import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="h-screen flex flex-col justify-center items-center px-4">
        <Loader2 className="animate-spin" size={32} />
        <div className="text-center">Loading...</div>
      </div>
    );

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default PrivateRoute;
