import React, { createContext, useContext, useState, ReactNode } from 'react';
import i18n from '../i18n'; // Ensure the path is correct

// Define the type for the context
interface LanguageContextType {
  language: string;
  changeLanguage: (newLanguage: string) => void;
}

// Create the Language context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Custom hook to use the Language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Provider for the Language context
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>('en');

  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage); // Change the language in i18next
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
