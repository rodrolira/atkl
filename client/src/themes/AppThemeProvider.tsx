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
      mode,
      primary: { main: '#1c9c7c' },
      secondary: { main: '#9DF3C4' },
      purple: { main: '#9333ea' },
      Ink: {
        Darkest: '#000000',
        Darker: '#222222',
        Dark: '#303437',
        Base: '#404446',
        Light: '#6C7072',
        Lighter: '#72777A',
      },
      Sky: {
        Dark: '#979C9E',
        Base: '#CDCFD0',
        Light: '#E3E5E5',
        Lighter: '#F2F4F5',
        Lightest: '#F7F9FA',
        White: '#FFFFFF',
      },

      Red: {
        Darkest: '#6B0206',
        Base: '#E8282B',
        Light: '#F94739',
        Lighter: '#FF9898',
        Lightest: '#FFE5E5',
      },

      Green: {
        Darkest: '#0A4C0A',
        Base: '#0F8B0F',
        Light: '#1EB01E',
        Lighter: '#7FF77F',
        Lightest: '#E5FFE5',
      },

      text: {
        primary: mode === 'dark' ? '#FFFFFF' : '#000000',
        secondary: '#999999',
        disabled: '#C3C1BD',
      },

      grey: {
        50: mode === 'dark' ? 'hsl(0, 0%, 10%)' : 'hsl(0, 5%, 95%)',
        100: mode === 'dark' ? 'hsl(0, 0%, 20%)' : 'hsl(0, 0%, 90%)',
        200: mode === 'dark' ? 'hsl(0, 0%, 30%)' : 'hsl(0, 0%, 80%)',
        300: mode === 'dark' ? 'hsl(0, 0%, 40%)' : 'hsl(0, 0%, 70%)',
        400: mode === 'dark' ? 'hsl(0, 0%, 50%)' : 'hsl(0, 0%, 60%)',
        500: mode === 'dark' ? 'hsl(0, 0%, 60%)' : 'hsl(0, 0%, 50%)',
        600: mode === 'dark' ? 'hsl(0, 0%, 70%)' : 'hsl(0, 0%, 40%)',
        700: mode === 'dark' ? 'hsl(0, 0%, 80%)' : 'hsl(0, 0%, 30%)',
        800: mode === 'dark' ? 'hsl(0, 0%, 90%)' : 'hsl(0, 0%, 20%)',
        900: mode === 'dark' ? 'hsl(0, 5%, 95%)' : 'hsl(0, 0%, 10%)',
      },
      gradient: {
        bronze: 'linear-gradient(180deg, #9C6D3E 0%, #E8C8A9 100%)',
        silver: 'linear-gradient(180deg, #808080 0%, #DFDFDF 100%)',
        gold: 'linear-gradient(180deg, #A3873C 0%, #E3D294 100%)',
      },
    } as PaletteOptions,

    typography: {
      fontFamily: 'Dosis, sans-serif',
      h1: { fontSize: '26px', fontWeight: '600', lineHeight: 1.3 },
      h2: { fontSize: '22px', fontWeight: '600', lineHeight: 1.25 },
      h3: { fontSize: '20px', fontWeight: '600', lineHeight: 1.2 },
      h4: { fontSize: '18px', fontWeight: '600', lineHeight: 1.3 },
      h5: { fontSize: '16px', fontWeight: '500', lineHeight: 1.4 },
      caption: {
        fontSize: '10px',
        fontWeight: '400',
        letterSpacing: '0.4px',
      },
      button: {
        fontSize: '14px',
        fontWeight: '500',
        letterSpacing: '0.75px',
        textTransform: 'uppercase',
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
