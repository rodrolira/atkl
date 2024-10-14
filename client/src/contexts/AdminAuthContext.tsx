import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  registerAdminRequest,
  loginAdminRequest,
  verifyAdminTokenRequest,
  logoutAdminRequest,
} from '@/app/api/admin';

// Definimos las interfaces necesarias
interface Admin {
  id: string;
  name: string;
  // Agrega otros campos según lo necesites
}

interface AdminAuthContextType {
  signin: (user: { username: string; password: string; }) => Promise<void>;
  signup: (user: { username: string; email: string; password: string; }) => Promise<void>;
  register: (user: { username: string; password: string; email: string; }) => Promise<void>;
  login: (user: { username: string; password: string; }) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  user: Admin | null;
  isAuthenticated: boolean;
  errors: string[];
}

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
      const token = localStorage.getItem('adminToken');
      if (token) {
        await verifyToken(token);
      } else {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const res = await verifyAdminTokenRequest(token);
      setIsAuthenticated(true);
      setUser(res.data.admin);
    } catch (error: any) {
      console.log('Admin verification failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      setErrors([error.response?.data?.message || 'Error verifying token']);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (user: { username: string; email: string; password: string }) => {
    try {
      const res = await registerAdminRequest(user);
      setUser(res.data);
      setIsAuthenticated(true);
      localStorage.setItem('adminToken', res.data.token);
    } catch (error: any) {
      setErrors([error.response.data.message]);
    }
  };

  const signin = async (credentials: { username: string; password: string; }) => {
    try {
      await loginAdminRequest(credentials); // Llama a la función de inicio de sesión

      const token = localStorage.getItem('adminToken');
      if (token) {
        await verifyToken(token);
      }

      setSigninError(null);
      const { username, password } = credentials;
      if (username === 'admin' && password === 'password') {
        setIsAuthenticated(true);
      } else {
        setSigninError('Invalid username or password');
      }
    } catch (error: any) {
      setSigninError(error.response.data.message);
      setErrors([error.response.data.message]);
    }
  };

  const signout = async () => {
    try {
      await logoutAdminRequest();
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('adminToken');
    } catch (error: any) {
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
        signin,
        signup,
        logout: signout,
        loading,
        register: signup,
        login: signin,
        user,
        isAuthenticated,
        errors,
        
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
