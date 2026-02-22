
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, token, loading } = useAuth();

  // ⏳ Wait for auth check (important on refresh)
  if (loading) {
    return <p>Checking authentication...</p>;
  }

  // ❌ Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // ⛔ Not approved
  if (user.role !== "admin" && user.status !== "approved") {
  return <Navigate to="/pending" replace />;
}


  return children;
};

export default ProtectedRoute;