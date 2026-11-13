import React, { createContext, useContext, useCallback, useEffect, useState, ReactNode } from 'react';

export type ThemeMode = 'dark' | 'light';

const STORAGE_KEY = 'atkl-theme';

interface ThemeModeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
  /** true mientras la preferencia la decide el sistema y no el usuario. */
  isSystemPreference: boolean;
}

const ThemeModeContext = createContext<ThemeModeContextType | undefined>(undefined);

export const useThemeMode = (): ThemeModeContextType => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode debe usarse dentro de ThemeModeProvider');
  }
  return context;
};

/**
 * Lee el modo que ya dejó aplicado el script inline de index.html. No vuelve a
 * calcularlo: si difiriera, React pintaría un frame con el tema equivocado.
 * Mantener las dos lógicas alineadas.
 */
const readInitialMode = (): ThemeMode =>
  document.documentElement.classList.contains('dark') ? 'dark' : 'light';

/**
 * Escribe el modo en el DOM. Se llama ANTES de setMode, no desde un efecto:
 * el tema de MUI se arma leyendo las variables CSS, y si la clase se aplicara
 * después del render, MUI construiría la paleta con los valores del modo
 * anterior. Eso inyectaba `body { background-color: #000 }` en modo claro.
 */
const applyMode = (mode: ThemeMode): void => {
  const root = document.documentElement;
  root.classList.toggle('dark', mode === 'dark');
  root.style.colorScheme = mode;
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute('content', mode === 'dark' ? '#000000' : '#FFFFFF');
};

export const ThemeModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(readInitialMode);
  const [isSystemPreference, setIsSystemPreference] = useState<boolean>(
    () => localStorage.getItem(STORAGE_KEY) === null
  );

  // Red de seguridad: si el estado y el DOM se desincronizan (por ejemplo tras
  // un hot reload), realinea. El camino normal ya aplicó la clase antes.
  useEffect(() => {
    applyMode(mode);
  }, [mode]);

  // Mientras el visitante no haya elegido, seguir al sistema si lo cambia.
  useEffect(() => {
    if (!isSystemPreference) return;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (e: MediaQueryListEvent) => {
      const next: ThemeMode = e.matches ? 'light' : 'dark';
      applyMode(next);
      setMode(next);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [isSystemPreference]);

  const toggleMode = useCallback(() => {
    const next: ThemeMode = document.documentElement.classList.contains('dark')
      ? 'light'
      : 'dark';
    // Primero el DOM, después el estado: así MUI arma la paleta con los
    // tokens del modo nuevo en el mismo render.
    applyMode(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Modo incógnito o storage lleno: el tema igual se aplica en esta sesión.
    }
    setMode(next);
    setIsSystemPreference(false);
  }, []);

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode, isSystemPreference }}>
      {children}
    </ThemeModeContext.Provider>
  );
};
