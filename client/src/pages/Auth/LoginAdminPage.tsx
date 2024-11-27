import AdminLoginForm from '@/components/Admin/AdminLoginForm';
import Navbar from '@/components/Navbar/Navbar';
import React from 'react';

const LoginAdminPage: React.FC = React.memo(() => {
  return (
    <div>
      <Navbar />
      <AdminLoginForm />
    </div>
  );
});

export default LoginAdminPage;
