import React, { createContext, useContext, useCallback, useState, useMemo, ReactNode } from 'react';
import { getGenresRequest } from '@/app/api/genres';
import { Genre } from '@/types/interfaces/Genre';

// Define the type for the context
interface GenreContextType {
  genres: Genre[]; // Adjust the type according to your data structure
  fetchGenres: () => Promise<Genre[]>; // Adjust return type based on the API response
}

// Create the Genre context
const GenreContext = createContext<GenreContextType | undefined>(undefined);

// Custom hook to use the Genre context
export const useGenres = () => {
  const context = useContext(GenreContext);

  if (!context) {
    console.log('useGenres must be used within a GenreProvider');
    throw new Error('useGenres must be used within a GenreProvider');
  }
  return context;
};

// Provider for the Genre context
export const GenreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [genres, setGenres] = useState<Genre[]>([]);

  // Function to fetch the list of genres from the API
  const fetchGenres = useCallback(async () => {
    const response = await getGenresRequest(); // Ensure the fetch works correctly
    setGenres(response.data); // Update the genres list with the API response
    return response.data;
  }, []);

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
