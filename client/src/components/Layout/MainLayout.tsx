import React, { ReactNode } from 'react';
import { Box, ThemeProvider } from '@mui/material';
import { theme } from '@/themes/theme';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundRepeat: 'no-repeat',
          backgroundBlendMode: 'darken',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#122e0f',
          height: '180vh',
        }}
        className="px-0 mx-auto relative overflow-hidden w-full flex h-screen"
      >
        {children}
      </Box>
    </ThemeProvider>
  );
};

export default MainLayout;
