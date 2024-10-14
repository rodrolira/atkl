// /contexts/ArtistContext
// This context should manage the state and operations related to a list of artists.

import { createContext, useContext, useState, useCallback } from 'react';
import {
  createArtistRequest,
  deleteArtistRequest,
  getArtistRequest,
  getArtistsRequest,
  updateArtistRequest,
} from '../app/api/artists';

export const ArtistContext = createContext();

export const useArtists = () => {
  const context = useContext(ArtistContext);

  if (!context) {
    console.log('useArtists must be used within an ArtistProvider');
    throw new Error('useArtists must be used within an ArtistProvider');
  }
  return context;
};

export const ArtistProvider = ({ children }) => {
  const [artists, setArtists] = useState([]); // Estado para almacenar la lista de artistas
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // Lógica para obtener la lista de artistas
  const fetchArtists = useCallback(async () => {
    // Asegúrate de que este fetch esté funcionando correctamente y devuelva los datos esperados.
    try {
      const response = await getArtistsRequest();
      setArtists(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching artists:', error);
      setError('Failed to fetch artists');
      setLoading(false);
    }
  }, []);

  const fetchArtist = async (id) => {
    try {
      const response = await getArtistRequest(id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching artist with ID ${id}:`, error);
      throw error;
    }
  };

  // Lógica para crear un artista
  const createArtist = async (artist) => {
    try {
      const res = await createArtistRequest(artist);
      setArtists((prevArtists) => [...prevArtists, res.data]);
      return res.data;
    } catch (error) {
      console.error('Error creating artist:', error);
    }
  };

  const updateArtist = async (id, updatedArtist) => {
    try {
      const response = await updateArtistRequest(id, updatedArtist);
      setArtists((prevArtists) =>
        prevArtists.map((artist) => (artist.id === id ? response.data : artist)),
      );
      return response;
    } catch (error) {
      console.error('Error updating artist:', error);
      throw error
    }
  };


  // Lógica para eliminar un artista
  const deleteArtist = async (id) => {
    try {
      await deleteArtistRequest(id);
      setArtists((prevArtists) =>
        prevArtists.filter((artist) => artist.id !== id));
    } catch (error) {
      console.error('Error deleting artist:', error);
      throw error
    }
  };

  return (
    <ArtistContext.Provider
      value={{
        artists,
        setArtists,
        createArtist,
        fetchArtists,
        fetchArtist,
        error,
        loading,
        updateArtist,
        deleteArtist,
      }}
    >
      {children}
    </ArtistContext.Provider>
  );
};
