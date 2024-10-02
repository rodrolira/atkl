import { useState } from 'react';
import {
  getReleaseRequest,
  updateReleaseRequest,
  deleteReleaseRequest,
} from '@/app/api/releases';

export const useReleases = (id) => {
  const [release, setRelease] = useState(null);

  const fetchRelease = async (id) => {
    try {
      const response = await getReleaseRequest(id);
      setRelease(response.data);
    } catch (error) {
      console.error('Error fetching Release:', error);
    }
  };

  const updateRelease = async (id, release) => {
    try {
      await updateReleaseRequest(id, release);
      fetchRelease(id);
    } catch (error) {
      console.error('Error updating Release:', error);
    }
  };

  const deleteRelease = async (id) => {
    try {
      await deleteReleaseRequest(id);
    } catch (error) {
      console.error('Error deleting Release:', error);
    }
  };

  return { release, fetchRelease, updateRelease, deleteRelease };
};
