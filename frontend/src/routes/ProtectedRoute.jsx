import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="auth-loading">Checking authentication...</div>;
  }

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Only normal users require approval
  if (user.role === "user" && user.status !== "approved") {
    return <Navigate to="/dashboard/pending" replace />;
  }

  return children;
};

export default ProtectedRoute;