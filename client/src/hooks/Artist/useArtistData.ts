// useArtistData.ts
import { useState, useEffect, useCallback } from 'react';
import { getArtistRequest } from '@/app/api/artists';
import { Artist } from '@/types/interfaces/Artist';


export const useArtistData = (id: string) => {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArtist = useCallback(async () => {
    try {
      const response = await getArtistRequest(Number(id));
    } catch (err) {
      console.error(err);
      setError('Error fetching artist');
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
