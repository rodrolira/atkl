// api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', // Usa VITE_API_URL en producción
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si el token expiró o fue revocado, limpiamos la sesión en vez de dejar la UI
// como "logueada" con un token muerto.
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const isAuthEndpoint = error?.config?.url?.includes('/login');

    if (status === 401 && !isAuthEndpoint && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.replace('/admin/login');
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
