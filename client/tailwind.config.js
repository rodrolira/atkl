/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    screens: {
      xxs: '320px',
      xs: '400px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      mobile: '360px',
      tablet: '640px',
      laptop: '1024px',
      desktop: '1280px',
    },
    extend: {
    colors: {
      // Tokens semánticos. Los valores viven en src/App.css como canales RGB,
      // con :root = modo claro y .dark = modo oscuro, así que estos nombres
      // cambian solos con el tema. El formato rgb(var(--x) / <alpha-value>)
      // es lo que mantiene vivos los modificadores de opacidad (bg-bg/30).
      bg: 'rgb(var(--bg) / <alpha-value>)',
      surface: 'rgb(var(--surface) / <alpha-value>)',
      text: 'rgb(var(--text) / <alpha-value>)',
      muted: 'rgb(var(--muted) / <alpha-value>)',
      accent: 'rgb(var(--accent) / <alpha-value>)',
      'accent-hover': 'rgb(var(--accent-hover) / <alpha-value>)',

      // Nombres heredados del manual de marca. El código ya los usaba como
      // fondo y texto (bg-black + text-white), no como colores literales, así
      // que apuntan a los mismos tokens y ~50 archivos invierten sin tocarlos.
      // Para código nuevo conviene usar los nombres semánticos de arriba.
      black: 'rgb(var(--bg) / <alpha-value>)',
      white: 'rgb(var(--text) / <alpha-value>)',
      'metallic-gray': 'rgb(var(--muted) / <alpha-value>)',
      'metallic-gray-dark': 'rgb(var(--muted) / <alpha-value>)',
      blood: 'rgb(var(--accent) / <alpha-value>)',
      'blood-dark': 'rgb(var(--accent-hover) / <alpha-value>)',

      // Literales que NO deben invertir: overlays sobre imagen y textos sobre
      // la portada, que siempre van sobre un fondo oscuro propio.
      'pure-black': '#000000',
      'pure-white': '#FFFFFF',
      transparent: 'transparent',
      current: 'currentColor',
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      display: ['"Inter Tight"', 'sans-serif'],
      mono: ['"JetBrains Mono"', 'monospace'],
    },
    fontSize: {
        xxs: '.6rem',
        xs: '.75rem',
        sm: '.875rem',
        tiny: '.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
        '7xl': '5rem',
        '8xl': '6rem',
        '9xl': '7rem',
        '10xl': '8rem',
      },
    },
  },
  plugins: [],
};
