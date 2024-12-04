// useArtistData.ts
import { useState, useEffect, useCallback } from 'react';
import { getArtistRequest } from '@/app/api/artists';
import { Artist } from '@/types/interfaces/Artist';


export const useArtistData = (id: string) => {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | boolean>(false);

  const fetchArtist = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getArtistRequest(id);
      console.log(response);
      setArtist(response.data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchArtist();
  }, [id]);

  return {
    artist,
    loading,
    error,
    refetch: fetchArtist, // Exporta la función para refrescar datos
  };
};
