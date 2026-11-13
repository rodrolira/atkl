import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useThemeMode } from '@/contexts/ThemeModeContext';

interface ThemeToggleProps {
  className?: string;
}

/**
 * Cambia entre modo oscuro y claro. La preferencia se guarda en localStorage
 * desde el contexto; index.html la aplica antes de pintar para que no haya
 * parpadeo de tema al cargar.
 */
const ThemeToggle = ({ className = '' }: ThemeToggleProps) => {
  const { mode, toggleMode } = useThemeMode();
  const { t } = useTranslation();
  const isDark = mode === 'dark';

  // El label dice la acción, no el estado: un lector de pantalla anuncia
  // "cambiar a modo claro", que es lo que pasa al activarlo.
  const label = isDark ? t('theme_switch_to_light') : t('theme_switch_to_dark');

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={label}
      title={label}
      // min-h/w-11 = 44px, el mínimo de área táctil accesible.
      className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-md
        border border-muted/30 text-muted
        transition-colors duration-200
        hover:border-accent hover:text-accent
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-accent
        active:scale-95 ${className}`}
    >
      <FontAwesomeIcon icon={isDark ? faSun : faMoon} className="text-lg" aria-hidden="true" />
    </button>
  );
};

export default ThemeToggle;
