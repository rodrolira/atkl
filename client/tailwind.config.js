/** @type {import('tailwindcss').Config} */
export default {
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
      black: '#000000',
      white: '#FFFFFF',
      'metallic-gray': '#9A9A9A',
      'metallic-gray-dark': '#4A4A4A',
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
