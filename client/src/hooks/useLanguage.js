import { useState, useEffect } from 'react';
import i18n from '../i18n.js'; // Asegúrate de que la ruta sea correcta

// Hook personalizado para manejar el idioma
export const useLanguage = () => {
  const [language, setLanguage] = useState('en');

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage); // Cambia el idioma en i18next
  };

  useEffect(() => {
    // En caso de que quieras inicializar el idioma con el de i18n
    const currentLanguage = i18n.language;
    if (currentLanguage) {
      setLanguage(currentLanguage);
    }
  }, []);

  return { language, changeLanguage };
};
