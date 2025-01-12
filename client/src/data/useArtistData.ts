// useArtistData.ts
import { useState, useEffect } from 'react';
import { Artist } from '@/types/interfaces/Artist';
import { artistData } from '@/data/artistData';


export const useArtistData = (id: string) => {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | boolean>(false);

 // Simula la obtención de datos del artista
 const fetchArtist = () => {
  try {
    setLoading(true);
    // Buscamos el artista por su ID en el array artistData
    const foundArtist = artistData.find(artist => artist.id === parseInt(id));
    if (foundArtist) {
      setArtist({
        ...foundArtist,
        Roles: foundArtist.roles.map(role => ({ label: role })),
        roleIds: [],
        image: null
      } as unknown as Artist);
    } else {
      throw new Error('Artist not found'); // Si no se encuentra el artista
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
