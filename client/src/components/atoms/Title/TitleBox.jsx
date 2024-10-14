import React from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useTranslation } from 'react-i18next';
const TitleBox = () => {
  const { t } = useTranslation();
  return (
    <Grid xs={12} sm={12} md={6} lg={6} xl={6} minHeight={550}>
      <Box
        sx={{
          backgroundImage: `linear-gradient(135deg, rgba(0, 255, 60, 0.3) , rgba(0, 157, 255, 0.3))`,
          display: {
            xs: 'none',
            sm: 'none',
            md: 'flex',
            lg: 'flex',
            xl: 'flex',
          },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '86%',
          borderRadius: '0px 30px 30px 0',
          marginTop: {
            xs: '0px',
            sm: '0px',
            md: '100px',
            lg: '100px',
            xl: '100px',
          },
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="flex-start"
        >
          <Typography variant="h4" fontWeight="bold" color="whitesmoke" mb={3}>
            {t('sign')} <br />{' '}
            {t('account')}
          </Typography>
          <Typography variant="body1" fontWeight="" color="whitesmoke">
            {t('checkReleases')}
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
};

export default TitleBox;
