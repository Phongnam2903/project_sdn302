import { Navigate } from "react-router-dom";
import { isTokenExpired } from "../utils/auth";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired()) {
    // deleted token if it's expired
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
