// api/artists.ts
import axios from './axios';

// Define los tipos para los artistas
interface Artist {
  id?: string; // Puedes usar '?' para indicar que es opcional
  name: string;
  [key: string]: any;
  // Agrega otros campos según sea necesario
}


export const fetchArtists = async (): Promise<Artist[]> => {
  const response = await axios.get('/artists');
  return response.data;
};

export const createArtist = async (artist: Artist): Promise<Artist> => {
  const formData = new FormData();
  Object.keys(artist).forEach((key) => {
    formData.append(key, artist[key]);
  });
  const response = await axios.post('/artists', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getArtistsRequest = async (): Promise<Artist[]> => {
  const response = await axios.get('/artists');
  return response.data;
};

export const getArtistRequest = async (id: string): Promise<Artist> => {
  const response = await axios.get(`/artists/${id}`);
  return response.data;
};

export const getArtistReleases = async (id: string): Promise<any> => { // Define un tipo más específico si es necesario
  const response = await axios.get(`/artists/${id}/releases`);
  return response.data;
};

export const createArtistRequest = async (artist: Artist): Promise<Artist> => {
  const response = await axios.post('/artists', artist);
  return response.data;
};

export const updateArtistRequest = async (artistId: string, artist: Artist): Promise<Artist> => {
  const response = await axios.put(`/artists/${artistId}`, artist, {
    headers: {
      'Content-Type': 'multipart/form-data', // Cambia a 'application/json' si no usas FormData
    },
  });
  return response.data;
};

export const deleteArtistRequest = async (id: string): Promise<void> => {
  await axios.delete(`/artists/${id}`);
};

export const getRolesRequest = async (): Promise<any> => { // Define un tipo más específico si es necesario
  const response = await axios.get('/roles');
  return response.data;
};
