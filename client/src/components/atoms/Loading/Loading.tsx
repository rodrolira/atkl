// src/components/atoms/Loading/Loading.tsx
import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Loading: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            bgcolor="#000000"
        >
            <CircularProgress color="inherit" role='progressbar' title="Loading" size={60} thickness={5} sx={{ color: 'text.primary' }} />
            <Typography variant="h6" color="inherit" mt={2} sx={{ color: 'text.primary', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {t('loading')}
            </Typography>
        </Box>
    );
};

export default React.memo(Loading);
