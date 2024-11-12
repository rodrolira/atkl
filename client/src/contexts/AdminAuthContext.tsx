import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  registerAdminRequest,
  loginAdminRequest,
  verifyAdminTokenRequest,
  logoutAdminRequest,
} from '../app/api/admin';
import { Admin, AdminAuthContextType } from '@/types/interfaces/Admin';



const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

interface AdminAuthProviderProps {
  children: ReactNode; // Acepta nodos React como hijos
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<Admin | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [signinError, setSigninError] = useState<string | null>(null);

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        await verifyToken(token);
      } else {
        setLoading(false);
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    checkLogin();
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const res = await verifyAdminTokenRequest();
      setIsAuthenticated(true);
      setUser(res.data.admin);
    } catch (error: any) {
      // console.log('Admin verification failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      setErrors([error.response?.message || 'Error verifying token']);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (user: Omit<Admin, 'id'>) => {
    try {
      const res = await registerAdminRequest(user);
      setUser(res.data);
      setIsAuthenticated(true);
      localStorage.setItem('token', res.data.token);
    } catch (error: any) {
      setErrors([error.response.data.message]);
    }
  };

  const signin = async (credentials: any) => {
    try {
      const response = await loginAdminRequest(credentials);
      if (response?.token && response.admin) {
        localStorage.setItem('token', response.token); // Store token
        setUser(response.admin);
        setIsAuthenticated(true);
      } else {
        throw new Error('Token not found');
      }
    } catch (error: any) {
      setErrors([error.response?.data?.message || 'Error during sign-in']);
    }
  };
  
  const signout = async () => {
    try {
      await logoutAdminRequest();
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('token');
    } catch (error: any) {
      setErrors([error.response?.data?.message]);
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


        signin: signin,
        signup: signup as (user: Omit<Admin, 'id'>) => Promise<void>,
        signout: signout,
        loading: loading,
        user: user,
        isAuthenticated: isAuthenticated,
        errors,

      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
