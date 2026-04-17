import React from 'react';
import { Navigate } from 'react-router-dom';

const TtaProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // If no token, redirect to login
    return <Navigate to="/login" replace />;
  }
  
  // Basic check for demo
  return children;
};

export default TtaProtectedRoute;
