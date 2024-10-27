import { useState } from 'react';
import {
  getReleaseRequest,
  updateReleaseRequest,
  deleteReleaseRequest,
} from '@/app/api/releases';
import { Release, UseReleaseReturn } from '@/types/interfaces/Release'

export const useReleases = (id: number | null): UseReleaseReturn => {
  const [release, setRelease] = useState(<Release | null>(null));
  const [error, setError] = useState<string | null>(null);

  const fetchRelease = async (releaseId: number) => {
    try {
      const response = await getReleaseRequest(releaseId);
      setRelease(response.data);
    } catch (error) {
      console.error('Error fetching Release:', error);
    }
  };

  const updateRelease = async (releaseId: number, updatedRelease: Partial<Release>) => {
    try {
      await updateReleaseRequest(releaseId, updatedRelease);
      fetchRelease(releaseId);
    } catch (error) {
      console.error('Error updating Release:', error);
    }
  };

  const deleteRelease = async (releaseId: number) => {
    try {
      await deleteReleaseRequest(releaseId);
    } catch (error) {
      console.error('Error deleting Release:', error);
    }
  };

  return { release, error, fetchRelease, updateRelease, deleteRelease };
};
