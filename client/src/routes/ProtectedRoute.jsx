import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated: adminAuthenticated, loading: adminLoading } = useAdminAuth();

  if (adminLoading) {
    return <div>Loading...</div>;
  }

  return adminAuthenticated ? children || null : <Redirect to="/login" />;
};

export default ProtectedRoute;
