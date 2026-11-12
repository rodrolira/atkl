// useArtistData.ts
import { useState, useEffect } from 'react';
import { Artist } from '@/types/interfaces/Artist';
import { getArtistRequest } from '@/app/api/artists';
import { normalizeArtist } from '@/contexts/ArtistContext';


export const useArtistData = (id: string) => {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | boolean>(false);

  const fetchArtist = async () => {
    if (!id) {
      setArtist(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(false);
      const { data } = await getArtistRequest(id);
      setArtist(normalizeArtist(data));
    } catch (err) {
      console.error(err);
      setArtist(null);
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
