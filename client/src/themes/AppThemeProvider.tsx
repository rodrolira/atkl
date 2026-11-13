import React from 'react';
import {
  PaletteOptions,
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { selectMode } from '@/features/user/userSlice';

interface AppThemeProviderProps {
  children: React.ReactNode;
}

const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
  const mode = useSelector(selectMode) || 'light';
  // Agrega validación y control de errores para responsiveFontSizes
  let theme = createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#FFFFFF' },
      secondary: { main: '#9A9A9A' },
      background: {
        default: '#000000',
        paper: '#000000',
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#9A9A9A',
        disabled: '#4A4A4A',
      },
      grey: {
        50: '#000000',
        100: '#0A0A0A',
        200: '#1A1A1A',
        300: '#2A2A2A',
        400: '#4A4A4A',
        500: '#6A6A6A',
        600: '#8A8A8A',
        700: '#9A9A9A',
        800: '#BEBEBE',
        900: '#FFFFFF',
      },
      gradient: {
        metallic: 'linear-gradient(180deg, #000000 0%, #1A1A1A 100%)',
      },
    } as PaletteOptions,

    typography: {
      fontFamily: '"Inter Tight", Inter, sans-serif',
      h1: {
        fontSize: '26px',
        fontWeight: '800',
        lineHeight: 1.2,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
      },
      h2: {
        fontSize: '22px',
        fontWeight: '700',
        lineHeight: 1.25,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      },
      h3: {
        fontSize: '20px',
        fontWeight: '700',
        lineHeight: 1.2,
        letterSpacing: '0.08em',
      },
      h4: {
        fontSize: '18px',
        fontWeight: '600',
        lineHeight: 1.3,
        letterSpacing: '0.05em',
      },
      h5: {
        fontSize: '16px',
        fontWeight: '500',
        lineHeight: 1.4,
        letterSpacing: '0.05em',
      },
      body1: {
        fontSize: '16px',
        fontWeight: '400',
        lineHeight: 1.5,
        letterSpacing: '0.02em',
      },
      body2: {
        fontSize: '14px',
        fontWeight: '400',
        lineHeight: 1.5,
        letterSpacing: '0.02em',
      },
      caption: {
        fontSize: '10px',
        fontWeight: '400',
        letterSpacing: '0.4px',
        textTransform: 'uppercase',
      },
      button: {
        fontSize: '14px',
        fontWeight: '600',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      },
      mono: {
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '14px',
        fontWeight: '400',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            cursor: 'pointer',
            textDecoration: 'none',
            lineHeight: 1.5,
            transition: 'all 0.1s ease-in-out',
            '&:hover': {
              opacity: 0.8,
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            aspectRatio: '1/1',
            height: 'auto',
            width: 'auto',
          },
        },
      },
    },
  });

  try{
    theme = responsiveFontSizes(theme);
  } catch (error) {
    console.error('Error appling responsiveFontSizes:', error);
  }
  
return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default AppThemeProvider;
