// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Component to protect routes that require authentication
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isLoggedIn, isAdmin, loading } = useContext(AuthContext);

  // Show loading while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is not logged in, redirect to login page
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // If route requires admin access but user is not admin, redirect to home page
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" />;
  }

  // Otherwise, render the protected content
  return children;
}
