import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import {
  createArtistRequest,
  deleteArtistRequest,
  getArtistRequest,
  getArtistsRequest,
  updateArtistRequest,
} from '../app/api/artists';
import { Artist, ArtistContextType } from '@/types/interfaces/Artist';




// Create the context with a default value
export const ArtistContext = createContext<ArtistContextType | undefined>(undefined);

// Custom hook to use the ArtistContext
export const useArtists = () => {
  const context = useContext(ArtistContext);
  
  if (!context) {
    console.log('useArtists must be used within an ArtistProvider');
    throw new Error('useArtists must be used within an ArtistProvider');
  }
  return context;
};

// ArtistProvider component
export const ArtistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch artists from the API
  const fetchArtists = useCallback(async () => {
    setLoading(true);
    setError(null); 
    try {
      const response = await getArtistsRequest();
      setArtists(response.data);
    } catch (error) {
      console.error('Error fetching artists:', error);
      setError('Failed to fetch artists');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchArtist = useCallback(async (id: number): Promise<Artist> => {
    try {
      const response = await getArtistRequest(id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching artist with ID ${id}:`, error);
      throw error;
    }
  }, []);

  // Create a new artist
  const createArtist = useCallback(async (artist: Artist): Promise<Artist | undefined> => {
    try {
      const res = await createArtistRequest(artist);
      setArtists((prevArtists) => [...prevArtists, res.data]);
      return res.data;
    } catch (error) {
      console.error('Error creating artist:', error);
      setError('Failed to create artist');
    }
  }, []);

  // Update an existing artist
  const updateArtist = useCallback(async (id: number, updatedArtist: Partial<Artist>): Promise<void> => {
    try {
      const response = await updateArtistRequest(id, updatedArtist);
      setArtists((prevArtists) =>
        prevArtists.map((artist) => (artist.id === id ? response.data : artist))
      );
    } catch (error) {
      console.error('Error updating artist:', error);
      setError('Failed to update artist');
      throw error;
    }
  }, []);

  // Delete an artist
  const deleteArtist = useCallback(async (id: number): Promise<void> => {
    try {
      await deleteArtistRequest(id);
      setArtists((prevArtists) =>
        prevArtists.filter((artist) => artist.id !== id)
      );
    } catch (error) {
      console.error('Error deleting artist:', error);
      setError('Failed to delete artist');
      throw error;
    }
  }, []);

  const contextValue = useMemo(() => ({
    artists,
    setArtists,
    createArtist,
    fetchArtists,
    fetchArtist,
    error,
    loading,
    updateArtist,
    deleteArtist,
  }), [
    artists,
    setArtists,
    createArtist,
    fetchArtists,
    fetchArtist,
    error,
    loading,
    updateArtist,
    deleteArtist,
  ]);

  return (
    <ArtistContext.Provider value={contextValue}>
      {children}
    </ArtistContext.Provider>
  );
};
