import React from 'react';
import { Stack, useTheme, Typography } from '@mui/material';
import { FormSX } from './Auth.styles';

function AuthOutlet({ children, header }) {
  const theme = useTheme();
  return (
    <form>
      <Stack
        gap={3}
        sx={{
          ...FormSX,
          border: `1px solid #9A9A9A`,
          background: '#000000',
          color: '#FFFFFF',
        }}
      >
        {header ? (
          <Typography textAlign="center" variant="h2" sx={{ color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            {header}
          </Typography>
        ) : (
          <img
            src="/logo.png"
            alt="ATKL Records logo"
            // brightness(0) antes de invert: si no, el logo verde sale magenta.
            style={{ width: '60px', height: 'auto', filter: 'brightness(0) invert(1)' }}
          />
        )}
        {children}
      </Stack>
    </form>
  );
}

export default React.memo(AuthOutlet);
