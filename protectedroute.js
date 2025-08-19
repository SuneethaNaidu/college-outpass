import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ user, role, allowedRoles, children }) {
  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If user's role is not in allowed roles, redirect to login or unauthorized page
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // Authorized: render the child component
  return children;
}
