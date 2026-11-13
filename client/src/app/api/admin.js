import axios from './axios';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return {};
  }
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const registerAdminRequest = (user) => axios.post('/admin/register', user, { withCredentials: true });

export const loginAdminRequest = async (credentials) => {
  const response = await axios.post('/admin/login', credentials, {
    withCredentials: true, // Habilitar el envío de cookies
  });
  return response.data;
};

export const verifyAdminTokenRequest = () => {
  return axios.get('/admin/verify', {
    headers: getAuthHeaders(),
  });
}

export const logoutAdminRequest = () =>
  axios.post('/admin/logout', {},
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    });

