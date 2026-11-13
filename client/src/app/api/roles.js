import api from './axios';

export const getRolesRequest = () => api.get('/roles');
