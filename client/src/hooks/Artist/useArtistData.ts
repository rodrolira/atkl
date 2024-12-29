// useArtistData.ts
import { useState, useEffect } from 'react';
import { Artist } from '@/types/interfaces/Artist';

// Datos simulados de un artista (puedes reemplazarlo con datos reales)
const mockArtistData: Artist = {
  id: 1,
  artist_name: 'Artist Name',
  image: 'artist-image.jpg',
  bio: 'This is a short biography of the artist.',
  Roles: [],
  roleIds: [],
};

export const useArtistData = (id: string) => {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | boolean>(false);

  // Simula la obtención de datos del artista
  const fetchArtist = () => {
    try {
      setLoading(true);
      // Aquí puedes simular una respuesta similar a la de la API
      if (parseInt(id) === mockArtistData.id) {
        setArtist(mockArtistData); // Asigna los datos simulados
      } else {
        throw new Error('Artist not found'); // Maneja un error si no se encuentra el artista
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtist();
  }, [id]);

  return {
    artist,
    loading,
    error,
    refetch: fetchArtist, // Exporta la función para refrescar datos si es necesario
  };
};
