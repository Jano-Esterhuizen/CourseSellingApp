import React from "react";
import { useAuth } from '../auth/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Logged in but doesn't have the required role
    return <Navigate to="/" replace />;
  }

  return children;
}
