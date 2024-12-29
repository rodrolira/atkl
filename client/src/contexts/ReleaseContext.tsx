import React, { createContext, useContext, useMemo, ReactNode, useState, useCallback, useEffect } from 'react';
import { Release, ReleaseContextType } from '@/types/interfaces/Release';

export const ReleaseContext = createContext<ReleaseContextType | undefined>(undefined);

export const useReleases = () => {
  const context = useContext(ReleaseContext);
  if (!context) {
    throw new Error('useReleases must be used within a ReleaseProvider');
  }
  return context;
};

export const ReleaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [releases, setReleases] = useState<Release[]>([]);

  // Cargar lanzamientos desde el almacenamiento local o usar los predeterminados
  const fetchReleases = useCallback(async () => {
    const storedReleases = localStorage.getItem('releases');
    if (storedReleases) {
      setReleases(JSON.parse(storedReleases));
    } else {
      const defaultReleases = [
        { id: 1, title: 'Release 1', artist_id: 1, cover_image_url: '', genre_id: 1, release_type: 'Single', release_date: '2023-01-01' },
        { id: 2, title: 'Release 2', artist_id: 2, cover_image_url: '', genre_id: 2, release_type: 'EP', release_date: '2023-02-01' },
      ];
      setReleases(defaultReleases);
    }
  }, []);

  // Guardar los lanzamientos en localStorage cada vez que se actualicen
  useEffect(() => {
    if (releases.length > 0) {
      localStorage.setItem('releases', JSON.stringify(releases));
    }
  }, [releases]);

  // Crear un nuevo lanzamiento
  const createRelease = (release: Release) => {
    const newRelease = { ...release, id: Date.now() }; // Asigna un ID único
    setReleases([...releases, newRelease]); // Actualiza el estado
  };

  // Actualizar un lanzamiento existente
  const updateRelease = (id: number, updatedRelease: Partial<Release>) => {
    setReleases((prevReleases) =>
      prevReleases.map((release) =>
        release.id === id ? { ...release, ...updatedRelease } : release
      )
    );
  };

  // Eliminar un lanzamiento
  const deleteRelease = async (id: number): Promise<void> => {
    return new Promise((resolve) => {
      setReleases((prevReleases) => {
        const updatedReleases = prevReleases.filter((release) => release.id !== id); // Filtra el lanzamiento a eliminar
        resolve(); // Resuelve la promesa
        return updatedReleases; // Devuelve la lista actualizada
      });
    });
  };


  const contextValue = useMemo(() => ({
    releases,
    setReleases,
    fetchReleases,
    createRelease,
    updateRelease,
    deleteRelease,
    loading: false,
    error: null,
  }), [releases, fetchReleases]);

  return <ReleaseContext.Provider value={contextValue}>{children}</ReleaseContext.Provider>;
};
