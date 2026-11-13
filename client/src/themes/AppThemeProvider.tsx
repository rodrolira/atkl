import React, { useMemo } from 'react';
import {
  PaletteOptions,
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from '@mui/material/styles';
import { useThemeMode } from '@/contexts/ThemeModeContext';
import { token, tokenAlpha } from './tokens';

interface AppThemeProviderProps {
  children: React.ReactNode;
}

const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
  // Antes leía `selectMode` de Redux pero no lo usaba: la paleta estaba fija
  // en oscuro con hex hardcodeados. Ahora sigue al mismo contexto que Tailwind
  // y toma los valores de las variables CSS, así los dos cambian juntos.
  const { mode } = useThemeMode();

  const theme = useMemo(() => {
    const t = (name: Parameters<typeof token>[0]) => token(name, mode);

    let built = createTheme({
    palette: {
      mode,
      primary: { main: t('accent'), contrastText: '#FFFFFF' },
      secondary: { main: t('muted') },
      background: {
        default: t('bg'),
        paper: t('surface'),
      },
      text: {
        primary: t('text'),
        secondary: t('muted'),
        disabled: tokenAlpha('muted', mode, 0.5),
      },
      divider: tokenAlpha('muted', mode, 0.3),
      gradient: {
        metallic: `linear-gradient(180deg, ${t('bg')} 0%, ${t('surface')} 100%)`,
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

    try {
      built = responsiveFontSizes(built);
    } catch (error) {
      console.error('Error aplicando responsiveFontSizes:', error);
    }

    return built;
    // Se reconstruye solo al cambiar de modo; antes se recreaba en cada render.
  }, [mode]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default AppThemeProvider;
