import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Archivos de traducción
import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';

// Respeta el idioma guardado por LanguageMenu para no renderizar en inglés y
// cambiar después (flash de contenido).
const savedLanguage =
  typeof localStorage !== 'undefined' ? localStorage.getItem('language') : null;

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      es: { translation: esTranslation },
    },
    lng: savedLanguage || 'en', // idioma por defecto
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React ya se encarga de esto
    },
  });

export default i18n;
