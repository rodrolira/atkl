import { useState, useCallback, useEffect } from 'react'
import i18n from '../i18n.js' // Ensure this path is correct

export function useLanguage(initialLanguage = 'en') {
  const [language, setLanguage] = useState(initialLanguage)

  const changeLanguage = useCallback((newLanguage) => {
    if (newLanguage !== language) {
      setLanguage(newLanguage)
      i18n.changeLanguage(newLanguage)
    }
  }, [language])

  useEffect(() => {
    // Initialize i18n with the initial language
    i18n.changeLanguage(initialLanguage)
  }, [initialLanguage])

  return { language, changeLanguage }
}
