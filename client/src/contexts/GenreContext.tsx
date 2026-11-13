import React, { createContext, useContext, useCallback, useState, useMemo, useEffect, ReactNode } from 'react';
import { Genre } from '@/types/interfaces/Genre';
import { getGenresRequest } from '@/app/api/genres';

interface GenreContextType {
  genres: Genre[];
  fetchGenres: () => Promise<Genre[]>;
}

const GenreContext = createContext<GenreContextType | undefined>(undefined);

export const useGenres = () => {
  const context = useContext(GenreContext);

  if (!context) {
    throw new Error('useGenres must be used within a GenreProvider');
  }
  return context;
};

export const GenreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [genres, setGenres] = useState<Genre[]>([]);

  const fetchGenres = useCallback(async () => {
    const { data } = await getGenresRequest();
    setGenres(data);
    return data as Genre[];
  }, []);

  useEffect(() => {
    fetchGenres().catch((error) => {
      console.error('Error fetching genres:', error);
    });
  }, [fetchGenres]);

  const value = useMemo(() => ({
    genres,
    fetchGenres,
  }), [genres, fetchGenres]);

  return (
    <GenreContext.Provider
      data-testid="genre-provider"
      value={value}
    >
      {children}
    </GenreContext.Provider>
  );
};
