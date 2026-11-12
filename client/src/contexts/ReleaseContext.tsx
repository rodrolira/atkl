// contexts/ReleaseContext.tsx
import React, { createContext, useContext, useMemo, ReactNode, useState, useEffect, useCallback } from 'react';
import { Release, ReleaseContextType } from '@/types/interfaces/Release';
import {
  getReleasesRequest,
  createReleaseRequest,
  updateReleaseRequest,
  deleteReleaseRequest,
} from '@/app/api/releases';

export const ReleaseContext = createContext<ReleaseContextType | undefined>(undefined);

export const useReleases = () => {
  const context = useContext(ReleaseContext);
  if (!context) {
    throw new Error('useReleases must be used within a ReleaseProvider');
  }
  return context;
};

const normalizeRelease = (release: Release): Release => ({
  ...release,
  imageUrl: release.cover_image_url || release.imageUrl || '',
});

export const ReleaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReleases = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getReleasesRequest();
      setReleases(data.map(normalizeRelease));
    } catch (err) {
      console.error('Error fetching releases:', err);
      setError('No se pudieron cargar los lanzamientos');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearReleases = () => {
    setReleases([]);
  };

  const createRelease = async (newRelease: Release): Promise<void> => {
    try {
      await createReleaseRequest(newRelease);
      await fetchReleases();
    } catch (err) {
      console.error('Error creating release:', err);
      setError('No se pudo crear el lanzamiento');
      throw err;
    }
  };

  const updateRelease = async (id: number, release: Partial<Release>): Promise<void> => {
    try {
      await updateReleaseRequest(id, release);
      await fetchReleases();
    } catch (err) {
      console.error('Error updating release:', err);
      setError('No se pudo actualizar el lanzamiento');
      throw err;
    }
  };

  const deleteRelease = async (id: number): Promise<void> => {
    try {
      await deleteReleaseRequest(id);
      setReleases((prev) => prev.filter((release) => release.id !== id));
    } catch (err) {
      console.error('Error deleting release:', err);
      setError('No se pudo eliminar el lanzamiento');
      throw err;
    }
  };

  useEffect(() => {
    fetchReleases();
  }, [fetchReleases]);

  const value = useMemo(() => ({
    releases,
    fetchReleases,
    createRelease,
    setReleases,
    clearReleases,
    loading,
    error,
    updateRelease,
    deleteRelease,
  }), [releases, fetchReleases, loading, error]);

  return (
    <ReleaseContext.Provider value={value}>
      {children}
    </ReleaseContext.Provider>
  );
};
