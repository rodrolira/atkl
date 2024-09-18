import React from 'react'
import { Box, ThemeProvider } from '@mui/material'
import { theme } from '@/themes/theme'

/**
 * Renders the main layout with a specified theme and background image.
 *
 * @param {Object} children - The elements to be rendered within the layout.
 * @return {JSX.Element} The main layout component.
 */
const MainLayout = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundRepeat: 'no-repeat',
          backgroundBlendMode: 'darken',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden',
          height: '180vh',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {children}
      </Box>
    </ThemeProvider>
  )
}

export default MainLayout
