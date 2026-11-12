import React, { createContext, useContext, useMemo, ReactNode, useState, useCallback, useEffect } from 'react';
import { Artist, ArtistContextType } from '@/types/interfaces/Artist';
import { Role } from '@/types/interfaces/Role';
import {
  getArtistsRequest,
  createArtistRequest,
  updateArtistRequest,
  deleteArtistRequest,
} from '@/app/api/artists';

export const ArtistContext = createContext<ArtistContextType | undefined>(undefined);

export const useArtists = () => {
  const context = useContext(ArtistContext);

  if (!context) {
    throw new Error('useArtists must be used within an ArtistProvider');
  }
  return context;
};

export const normalizeArtist = (artist: Artist): Artist => ({
  ...artist,
  imageUrl: artist.imageUrl || artist.image || '',
  roleIds: Array.isArray(artist.Roles)
    ? artist.Roles
        .filter((role): role is Role => typeof role === 'object')
        .map((role) => role.id)
    : artist.roleIds || [],
});

export const ArtistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArtists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getArtistsRequest();
      // El API pagina: devuelve { artists, pagination }. Toleramos ambas formas.
      const list = Array.isArray(data) ? data : (data?.artists ?? []);
      setArtists(list.map(normalizeArtist));
    } catch (err) {
      console.error('Error fetching artists:', err);
      setError('No se pudieron cargar los artistas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  const createArtist = async (artist: Artist): Promise<Artist | null> => {
    try {
      const { data } = await createArtistRequest(artist);
      const created = normalizeArtist(data);
      setArtists((prevArtists) => [...prevArtists, created]);
      return created;
    } catch (err) {
      console.error('Error creating artist:', err);
      const message = (err as any)?.response?.data?.message;
      setError(message || 'No se pudo crear el artista');
      return null;
    }
  };

  const updateArtist = async (id: number, updatedArtist: Partial<Artist>): Promise<void> => {
    try {
      const { data } = await updateArtistRequest(id, updatedArtist);
      const saved = normalizeArtist(data);
      setArtists((prevArtists) =>
        prevArtists.map((artist) => (artist.id === id ? saved : artist))
      );
    } catch (err) {
      console.error('Error updating artist:', err);
      setError('No se pudo actualizar el artista');
      throw err;
    }
  };

  const deleteArtist = async (id: number): Promise<void> => {
    try {
      await deleteArtistRequest(id);
      setArtists((prevArtists) => prevArtists.filter((artist) => artist.id !== id));
    } catch (err) {
      console.error('Error deleting artist:', err);
      setError('No se pudo eliminar el artista');
      throw err;
    }
  };

  const contextValue = useMemo(() => ({
    artists,
    setArtists,
    fetchArtists,
    createArtist,
    updateArtist,
    deleteArtist,
    error,
    loading,
  }), [artists, fetchArtists, error, loading]);

  return <ArtistContext.Provider value={contextValue}>{children}</ArtistContext.Provider>;
};
