// contexts/ReleaseContext.tsx
import React, { createContext, useContext, useMemo, ReactNode, useState, useEffect } from 'react';
import { Release, ReleaseContextType } from '@/types/interfaces/Release';
import { releaseData } from '@/data/releaseData'; // Asegúrate de importar los datos predeterminados

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

    // Función para borrar los lanzamientos
    const clearReleases = () => {
      localStorage.removeItem('releases'); // Elimina 'releases' del localStorage
      setReleases([]); // Vacía el estado de releases
    };

  // Función para cargar los lanzamientos
  const fetchReleases = (): Promise<void> => {
    return new Promise((resolve) => {
      const storedReleases = localStorage.getItem('releases');
      if (storedReleases) {
        setReleases(JSON.parse(storedReleases));
      } else {
        setReleases(releaseData);  // Usar datos predeterminados si no hay datos en localStorage
      }
      resolve(); // Terminar la promesa
    });
  };

  // Crear un nuevo lanzamiento y actualizar el estado y localStorage
  const createRelease = async (newRelease: Release): Promise<void> => {
    const updatedReleases = [...releases, newRelease];
    setReleases(updatedReleases);
    localStorage.setItem('releases', JSON.stringify(updatedReleases));
    return Promise.resolve();
  };

  
  useEffect(() => {
    fetchReleases(); // Cargar los lanzamientos al montar el componente
  }, []);

  return (
    <ReleaseContext.Provider value={{
      releases,
      fetchReleases,
      createRelease,
      setReleases,
      clearReleases,
      loading: false,
      error: null,
      fetchRelease: async (id) => releases.find(r => r.id === id) || releases[0],
      updateRelease: async (id, release) => {
        setReleases(prev => prev.map(r => r.id === id ? { ...r, ...release } : r));
      },
      deleteRelease: async (id) => {
        setReleases(prev => prev.filter(r => r.id !== id));
      }
    }}>
      {children}
    </ReleaseContext.Provider>
  );
};