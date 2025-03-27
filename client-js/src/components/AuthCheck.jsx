import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCheck = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // If still checking authentication status, show loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // If not authenticated, redirect to register page with the current location in state
  // so we can redirect back after login
  if (!isAuthenticated) {
    return <Navigate to="/register" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the children components
  return children;
};

export default AuthCheck; 