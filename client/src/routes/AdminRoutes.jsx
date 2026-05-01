import React from 'react';
import { Redirect } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import Loading from '@/components/atoms/Loading/Loading';

const AdminRoutes = () => {
  const { isAuthenticated: adminAuthenticated, loading: adminLoading } = useAdminAuth();

  if (adminLoading) {
    return <div><Loading /></div>;
  }

  return adminAuthenticated ? null : <Redirect to="/admin/login" />;
};

export default AdminRoutes;
