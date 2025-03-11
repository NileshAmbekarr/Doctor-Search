import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ role }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If role is specified and user doesn't have that role, redirect to appropriate dashboard
  if (role && user.role !== role) {
    const redirectPath = user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // If authenticated and has correct role, render the child routes
  return <Outlet />;
};

export default PrivateRoute; 