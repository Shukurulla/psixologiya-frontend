import React from "react";
import { Navigate } from "react-router-dom";
import { authService } from "../../services/auth";

const ProtectedRoute = ({ children, role }) => {
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getRole();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
