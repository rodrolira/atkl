// hooks/useArtist.ts
import { useState, useEffect } from 'react';
import {
  getArtistRequest,
  updateArtistRequest,
  deleteArtistRequest,
} from '@/app/api/artists';
import { Artist, UseArtistReturn } from '@/types/interfaces/Artist';


export const useArtist = (id: number | null): UseArtistReturn => {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchArtist = async (artistId: number) => {
    try {
      const response = await getArtistRequest(artistId);
      setArtist(response.data);
    } catch (error) {
      setError('Error fetching artist');
    }
  };

  const updateArtist = async (artistId: number, updatedArtist: Partial<Artist>) => {
    try {
      await updateArtistRequest(artistId, updatedArtist);
      fetchArtist(artistId);
    } catch (error) {
      setError('Error updating artist');
    }
  };

  const deleteArtist = async (artistId: number) => {
    try {
      await deleteArtistRequest(artistId);
    } catch (error) {
      setError('Error deleting artist');
    }
  };

  useEffect(() => {
    if (id !== null) {
      fetchArtist(id);
    } else {
      setArtist(null);
    }
  }, [id]);

  return { artist, error, fetchArtist, updateArtist, deleteArtist };
};
