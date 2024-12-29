import React, { createContext, useContext, useMemo, ReactNode, useState, useCallback, useEffect } from 'react';
import { Artist, ArtistContextType } from '@/types/interfaces/Artist';

// Create the context with a default value
export const ArtistContext = createContext<ArtistContextType | undefined>(undefined);

// Custom hook to use the ArtistContext
export const useArtists = () => {
  const context = useContext(ArtistContext);

  if (!context) {
    throw new Error('useArtists must be used within an ArtistProvider');
  }
  return context;
};

// ArtistProvider component
export const ArtistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [artists, setArtists] = useState<Artist[]>([]);

  // Cargar artistas desde el almacenamiento local o usar los predeterminados
  const fetchArtists = useCallback(() => {
    const storedArtists = localStorage.getItem('artists');
    if (storedArtists) {
      setArtists(JSON.parse(storedArtists));
    } else {
      const defaultArtists = [
        { id: 1, artist_name: 'Artist 1', image: null, roleIds: [1, 2], Roles: ['Producer / DJ'], bio: 'Bio 1' },
        { id: 2, artist_name: 'Artist 2', image: null, roleIds: [2], Roles: ['DJ'], bio: 'Bio 2' },
      ];
      setArtists(defaultArtists);
    }
    return Promise.resolve();
  }, []);

  // Guardar los artistas en localStorage cada vez que se actualicen
  useEffect(() => {
    if (artists.length > 0) {
      localStorage.setItem('artists', JSON.stringify(artists));
    }
  }, [artists]);

  // Crear un nuevo artista
  const createArtist = async (artist: Artist): Promise<Artist | null> => {
    try {
      const newArtist = { ...artist, id: Date.now() }; // Asigna un ID único
      setArtists((prevArtists) => [...prevArtists, newArtist]); // Actualiza el estado
      return newArtist; // Devuelve el nuevo artista
    } catch (error) {
      console.error('Error creating artist:', error);
      return null; // Resuelve con null en caso de error
    }
  };

  // Actualizar un artista existente
  const updateArtist = async (id: number, updatedArtist: Partial<Artist>): Promise<void> => {
    setArtists((prevArtists) => {
      const artistIndex = prevArtists.findIndex((artist) => artist.id === id);
      if (artistIndex !== -1) {
        const updatedArtists = [...prevArtists];
        updatedArtists[artistIndex] = { ...updatedArtists[artistIndex], ...updatedArtist };
        return updatedArtists; // Devuelve la lista actualizada
      }
      return prevArtists; // Devuelve el estado anterior si no se encuentra el artista
    });
  };

  // Eliminar un artista
  const deleteArtist = async (id: number): Promise<void> => {
    setArtists((prevArtists) => {
      const updatedArtists = prevArtists.filter((artist) => artist.id !== id);
      return updatedArtists; // Devuelve la lista actualizada
    });
  };

  const contextValue = useMemo(() => ({
    artists,
    setArtists,
    fetchArtists,
    createArtist,
    updateArtist,
    deleteArtist,
    error: null,
    loading: false,
  }), [artists]);

  return <ArtistContext.Provider value={contextValue}>{children}</ArtistContext.Provider>;
};
