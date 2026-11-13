import React, { ReactNode } from 'react';
import { Box } from '@mui/material';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * Antes este componente montaba su propio <ThemeProvider theme={theme}> con un
 * segundo tema de MUI (themes/theme.jsx, la paleta vieja de verdes y azules).
 * Eso pisaba al tema de AppThemeProvider para todo lo que colgara de aca, asi
 * que MUI nunca podia seguir el modo claro/oscuro. Ahora hereda el tema de
 * arriba, que es el que lee los tokens.
 */
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // Token en vez de '#000000' fijo: si no, el fondo de la app no
        // acompanaba el cambio de modo. Se quito backgroundBlendMode: 'darken',
        // que no hacia nada sin imagen de fondo y en claro habria oscurecido.
        backgroundColor: 'rgb(var(--bg))',
        color: 'rgb(var(--text))',
        minHeight: {
          xs: '100vh',
        },
      }}
      className="px-0 mx-auto relative overflow-hidden w-full flex"
    >
      {children}
    </Box>
  );
};

export default MainLayout;
