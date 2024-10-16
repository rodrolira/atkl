// useArtistData.js
import { useState, useEffect } from 'react';
import { getArtistRequest } from '../../app/api/artists';


export const useArtistData = (id: string) => {
  const [artist, setArtist] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        setLoading(true); // Iniciar carga
        const response = await getArtistRequest(id);
        setArtist(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar el artista'); // Manejo de errores
        setLoading(false);
      }
    };
    fetchArtist();
  }, [id]);

  return { artist, error, loading };
};
