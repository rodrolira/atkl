import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const PrivateRoutes = ({ children }) => {
  const { isAuthenticated: adminAuthenticated, loading: adminLoading } = useAdminAuth();

  if (adminLoading) {
    return <div>Loading...</div>;
  }

  if (adminAuthenticated) {
    return <Redirect to="/admin" />;
  }

  return children || null;
};

export default PrivateRoutes;
