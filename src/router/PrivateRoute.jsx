import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="text-center mt-20 text-muted-foreground">Loading...</div>
    );
  }

  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }

  return children;
};

export default PrivateRoute;
