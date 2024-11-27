import React from 'react';
import { Box, Grid } from '@mui/material';
import AdminSignin from './AdminSignin';
import MainLayout from '../Layout/MainLayout';
import styles from '@/pages/Auth/Auth.module.css';


const AdminLoginForm: React.FC = () => {
  return (
    <div className={styles.auth}>
      <MainLayout>
        <Box
          sx={{
            width: {
              sm: '90vw',
              xs: '90vw',
              md: '60vw',
              lg: '60vw',
              xl: '60vw',
            },
            margin: ' auto',
            marginTop:{
              sm: 8,
              xs: 6,
              md: 10,
              lg: 15,
              xl: 15,
            }
          }}
        >
          {/* GRID SYSTEM */}
          <Grid
            container
            justifyContent="center"
            alignItems="center"
          >
            <AdminSignin />
          </Grid>
          {/* GRID SYSTEM END */}
        </Box>
      </MainLayout>
    </div>
  );
};

export default React.memo(AdminLoginForm);
