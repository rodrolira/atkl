import axios from './axios';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found in localStorage');
    return {};
  }
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const registerAdminRequest = (user) => axios.post('/admin/register', user, { withCredentials: true });

export const loginAdminRequest = async (credentials) => {
  try {
    const response = await axios.post('/admin/login', credentials, {
      withCredentials: true, // Habilitar el envío de cookies
    });
    console.log('Server response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const verifyAdminTokenRequest = () => {
  return axios.get('/admin/verify', {
    headers: getAuthHeaders(),
    withCredentials: true,
  });
}

export const logoutAdminRequest = () =>
  axios.post('/admin/logout', {},
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    });

