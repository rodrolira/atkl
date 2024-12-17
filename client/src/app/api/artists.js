// api/artists.ts
import axios from './axios';



export const fetchArtists = async () => {
  const response = await axios.get('/artists');
  return response.data;
};

export const createArtist = async (artistData) => {
  try {
    const response = await axios.post('/artists', artistData, {
      headers: {
        'Content-Type': 'aaplication/json',
      },
    });
    return response.data;

  } catch (error) {
    console.error('Error creating artist:', error);
    throw error;
  }
};

export const getArtistsRequest = () => axios.get('/artists');
export const getArtistRequest = (id) => {
  if (!id) {
    throw new Error('Invalid artist ID');
  }

  return axios.get(`/artists/${id}`);
}

export const getArtistReleases = (id) => {
  return axios.get(`/artists/${id}/releases`);
};

export const createArtistRequest = async (artist) => {
  const formData = new FormData();
  Object.keys(artist).forEach((key) => {
    formData.append(key, artist[key]);
  })
  return await axios.post('/artists', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

};

export const updateArtistRequest = async (artistId, artist) => {
  const formData = new FormData();
  Object.keys(artist).forEach((key) => {
    formData.append(key, artist[key]);
  })
  return await axios.put(`/artists/${artistId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Cambia a 'application/json' si no usas FormData
    },
  });
};
export const deleteArtistRequest = async (id) => {
  return await axios.delete(`/artists/${id}`);

};

export const getRolesRequest = async () => {

  return await axios.get('/roles', {
    headers: {
      'Content-Type': 'application/json',
    },
  });

};
