/**
 * Puente entre los tokens CSS (src/App.css) y el tema de MUI.
 *
 * Los valores se leen de las variables CSS en vez de duplicarse acá: así no
 * pueden desfasarse cuando se toque la paleta. Los tokens están declarados
 * como canales RGB ("0 0 0") para que Tailwind les aplique opacidad, por eso
 * hay que envolverlos en rgb().
 */
export type TokenName = 'bg' | 'surface' | 'text' | 'muted' | 'accent' | 'accent-hover';

/** Respaldos por si se pide un token antes de que la hoja de estilos aplique. */
const FALLBACK: Record<'dark' | 'light', Record<TokenName, string>> = {
  dark: {
    bg: '0 0 0',
    surface: '17 17 17',
    text: '255 255 255',
    muted: '154 154 154',
    accent: '225 6 0',
    'accent-hover': '255 45 26',
  },
  light: {
    bg: '255 255 255',
    surface: '244 244 244',
    text: '10 10 10',
    muted: '74 74 74',
    accent: '225 6 0',
    'accent-hover': '176 5 0',
  },
};

const readChannels = (name: TokenName, mode: 'dark' | 'light'): string => {
  if (typeof window === 'undefined') return FALLBACK[mode][name];
  const value = getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();
  return value || FALLBACK[mode][name];
};

/** Devuelve el token como color CSS usable por MUI: `rgb(225 6 0)`. */
export const token = (name: TokenName, mode: 'dark' | 'light'): string =>
  `rgb(${readChannels(name, mode)})`;

/** Mismo token con opacidad, para bordes y superficies tenues. */
export const tokenAlpha = (name: TokenName, mode: 'dark' | 'light', alpha: number): string =>
  `rgb(${readChannels(name, mode)} / ${alpha})`;

/**
 * Token como hex SIN el '#'. Lo pide el embed de Bandcamp en sus parámetros
 * bgcol y linkcol, que no aceptan rgb() ni el numeral.
 */
export const tokenHex = (name: TokenName, mode: 'dark' | 'light'): string =>
  readChannels(name, mode)
    .split(/\s+/)
    .map((c) => Math.max(0, Math.min(255, Number(c))).toString(16).padStart(2, '0'))
    .join('');
