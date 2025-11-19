// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  // If user not logged in
  if (!token) return <Navigate to="/login" replace />;

  // If user role not allowed
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
