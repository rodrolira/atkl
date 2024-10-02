// /contexts/ArtistContext
// This context should manage the state and operations related to a list of artists.

import { createContext, useContext, useState, useCallback } from 'react';
import {
  createArtistRequest,
  deleteArtistRequest,
  getArtistRequest,
  getArtistsRequest,
  updateArtistRequest,
} from '@/app/api/artists';

const ArtistContext = createContext();

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
  const [error, setError] = useState(null);
  const [artist, setArtist] = useState(null);
  const fetchArtist = async (artist) => {
    try {
      const response = await getArtistRequest(artist);
      setArtist(response.data);
    } catch (error) {
      setError(error);
    }
  };
  // Lógica para obtener la lista de artistas
  const fetchArtists = useCallback(async () => {
    // Asegúrate de que este fetch esté funcionando correctamente y devuelva los datos esperados.
    try {
      const response = await getArtistsRequest();
      setArtists(response.data);
    } catch (error) {
      console.error('Error fetching artists:', error);
    }
  }, []);

  // Lógica para crear un artista
  const createArtist = async (artist) => {
    try {
      const res = await createArtistRequest(artist);
      setArtists((prevArtists) => [...prevArtists, res.data]);
    } catch (error) {
      console.error('Error creating artist:', error);
    }
  };

  const updateArtist = async (artist, updatedArtist) => {
    try {
      await updateArtistRequest(artist, updatedArtist);
      fetchArtist(artist);
    } catch (error) {
      setError(error);
    }
  };

  // Lógica para eliminar un artista
  const deleteArtist = async (artist) => {
    try {
      await deleteArtistRequest(artist);
      setArtist(null);
    } catch (error) {
      setError(error);
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
        artist,
        setArtist,
        error,
        setError,
        updateArtist,
        deleteArtist,
      }}
    >
      {children}
    </ArtistContext.Provider>
  );
};
