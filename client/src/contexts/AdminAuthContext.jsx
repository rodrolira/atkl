// AdminAuthProvider.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import {
  registerAdminRequest,
  loginAdminRequest,
  verifyAdminTokenRequest,
  logoutAdminRequest,
} from '@/app/api/admin';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        await verifyToken(token);
      } else {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  const verifyToken = async (token) => {
    // Añadido parametro token
    try {
      const res = await verifyAdminTokenRequest(token); // Pasar el token a la solicitud
      setIsAuthenticated(true);
      setUser(res.data.admin);
    } catch (error) {
      console.log('Admin verification failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      setErrors([error.response?.data?.message || 'Error verifying token']);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (user) => {
    try {
      const res = await registerAdminRequest(user);
      setUser(res.data);
      setIsAuthenticated(true);
      localStorage.setItem('adminToken', res.data.token);
    } catch (error) {
      setErrors([error.response.data.message]);
    }
  };

  const signin = async (user) => {
    try {
      const res = await loginAdminRequest(user);
      const { token, adminData } = res.data;

      setIsAuthenticated(true);
      setUser(adminData);
      localStorage.setItem('adminToken', token);
    } catch (error) {
      setErrors([error.response.data.message]);
    }
  };

  const signout = async () => {
    try {
      await logoutAdminRequest();
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('adminToken');
    } catch (error) {
      setErrors([error.response.data.message]);
    }
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  return (
    <AdminAuthContext.Provider
      value={{
        signup,
        signin,
        signout,
        loading,
        user,
        isAuthenticated,
        errors,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
