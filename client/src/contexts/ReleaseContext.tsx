/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  getReleasesRequest,
  getReleaseRequest,
  createReleaseRequest,
  updateReleaseRequest,
  deleteReleaseRequest,
} from '@/app/api/releases';
import { Release, ReleaseContextType } from '@/types/interfaces/Release'; // Define la interfaz `Release` para representar un release


export const ReleaseContext = createContext<ReleaseContextType | undefined>(undefined);

export const useReleases = () => {
  const context = useContext(ReleaseContext);

  if (!context) {
    console.log('useReleases must be used within a ReleaseProvider');
    throw new Error('useReleases must be used within a ReleaseProvider');
  }

  return context;
};

// Definir las props del ReleaseProvider
interface ReleaseProviderProps {
  children: ReactNode;
}

export const ReleaseProvider: React.FC<ReleaseProviderProps> = ({ children }) => {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lógica para obtener la lista de releases
  const fetchReleases = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getReleasesRequest();
      setReleases(response.data);
    } catch (error) {
      console.error('Error fetching releases:', error);
      setError('Failed to fetch releases');
    } finally {
      setLoading(false);
    }
  }, []);

  // Lógica para obtener un release por ID
  const fetchRelease = async (id: number): Promise<Release> => {
    try {
      const response = await getReleaseRequest(id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching release with ID ${id}:`, error);
      throw error;
    }
  };

  // Lógica para crear un release
  const createRelease = async (release: Release): Promise<void> => {
    try {
      const res = await createReleaseRequest(release);
      setReleases((prevReleases) => [...prevReleases, res.data]);
      return res.data;
    } catch (error) {
      console.error('Error creating release:', error);
    }
  };

  // Lógica para actualizar un release
  const updateRelease = async (id: number, updatedRelease: Partial<Release>): Promise<void> => {
    try {
      const response = await updateReleaseRequest(id, updatedRelease);
      setReleases((prevReleases) =>
        prevReleases.map((release) => (release.id === id ? response.data : release)),
      );
      return response.data;
    } catch (error) {
      console.error('Error updating release:', error);
      throw error;
    }
  };

  // Lógica para eliminar un release
  const deleteRelease = async (id: number): Promise<void> => {
    try {
      await deleteReleaseRequest(id);
      setReleases((prevReleases) =>
        prevReleases.filter((release) => release.id !== id),
      );
    } catch (error) {
      console.error('Error deleting release:', error);
      throw error;
    }
  };

  const value = {
    releases,
    loading,
    error,
    fetchReleases,
    fetchRelease,
    createRelease,
    updateRelease,
    deleteRelease,
    setReleases,
  };
  return (
    <ReleaseContext.Provider
      value={value}
    >
      {children}
    </ReleaseContext.Provider>
  );
};
