import api from './axios';

export const getGenresRequest = () => api.get('/genres');

export const getGenreRequest = (id) => api.get(`/genres/${id}`);
