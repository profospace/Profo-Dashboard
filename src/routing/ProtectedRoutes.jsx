// components/ProtectedRoutes.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoutes = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);

  // Check if user is authenticated
  if (!user || !token) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render the protected component if authenticated
  return children;
};

export default ProtectedRoutes;