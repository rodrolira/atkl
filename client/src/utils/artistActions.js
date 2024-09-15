// src/utils/artistActions.js

import { getArtistRequest, deleteArtistRequest } from '@/app/api/artists'; // Asegúrate de usar el nombre correcto de tus requests
import { useArtists } from '@/contexts/ArtistContext';

// Función para editar un artista
export const handleEditArtist = async (artistId, setCurrentArtist, setShowEditModal) => {
  try {
    const response = await getArtistRequest(artistId);
    setCurrentArtist(response.data);
    setShowEditModal(true);
  } catch (error) {
    console.error('Error fetching artist for edit:', error);
  }
};

// Función para eliminar un artista
export const handleDeleteArtist = async (artistId, setArtists) => {
  if (window.confirm('¿Estás seguro de que deseas eliminar al artista?')) {
    try {
      await deleteArtistRequest(artistId); // Ajusta el nombre si es diferente
      setArtists((prevArtists) => prevArtists.filter((artist) => artist.id !== artistId));
    } catch (error) {
      console.error('Error deleting artist:', error);
    }
  }
};
