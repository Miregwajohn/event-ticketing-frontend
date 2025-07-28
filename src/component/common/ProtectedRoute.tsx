// src/component/common/ProtectedRoute.tsx

import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const location = useLocation();

  if (!user) {
    // Not logged in? Redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin routes should start with this path
  const isAdminRoute = location.pathname.startsWith("/dashboard/admin");

  if (isAdminRoute && user.role !== "admin") {
    // Logged in, but not admin -> Redirect to user dashboard
    return <Navigate to="/dashboard/me" replace />;
  }

  // All checks passed -> render child components
  return <>{children}</>;
};

export default ProtectedRoute;
