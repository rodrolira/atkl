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
            bgcolor="linear-gradient(
    var(--primary-color),
    var(--secondary-color)
  )"
        >
            <CircularProgress color="secondary" role='progressbar' title="Loading" size={60} thickness={5} />
            <Typography variant="h6" color="primary" mt={2}>
                {t('loading')}
            </Typography>
        </Box>
    );
};

export default Loading;
