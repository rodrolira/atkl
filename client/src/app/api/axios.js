// api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', // Usa VITE_API_URL en producción
  withCredentials: true,
});

export default instance;
