import axios from './axios';
const API_URL = 'http://localhost:1337/api/artists';

export const fetchArtists = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createArtist = async (artist) => {
  const formData = new FormData();
  Object.keys(artist).forEach((key) => {
    formData.append(key, artist[key]);
  });
  const response = await axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};


export const getArtistsRequest = () => axios.get('/artists');
export const getArtistRequest = (id) => axios.get(`/artists/${id}`);

export const getArtistReleases = (id) => {
  return axios.get(`/artists/${id}/releases`);
};

export const createArtistRequest = async (artist) => {
  return await axios.post('/artists', artist);
};

export const updateArtistRequest = async (id, artist) => {
  return await axios.put(`/artists/${id}`, artist);
};

export const deleteArtistRequest = async (id) => {
  return await axios.delete(`/artists/${id}`);
};

export const getRolesRequest = async () => {
  return await axios.get('/roles');
};
