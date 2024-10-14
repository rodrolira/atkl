// useArtistData.js
import { useState, useEffect } from 'react';
import { getArtistRequest } from '../app/api/artists';

// Define el tipo para el artista (ajusta los campos según tu API)
interface Artist {
  id: string;
  name: string;
  // Agrega otros campos relevantes
}

export const useArtistData = (id: string) => {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        setLoading(true); // Iniciar carga
        const response = await getArtistRequest(id);
        setArtist(response.data);
        setError(null); // Limpiar el error si la solicitud es exitosa
      } catch (err: unknown) {
        if (err instanceof Error) {
        setError(err.message || 'Error al cargar el artista'); // Manejo de errores
        setArtist(null); // Limpiar datos de artista en caso de error
      } else {
        setError('Error desconocido'); // Manejo de errores desconocidos
        setArtist(null); // Limpiar datos de artista en caso de error
      }
      }
    };
    fetchArtist();
  }, [id]);

  return { artist, error, loading };
};
