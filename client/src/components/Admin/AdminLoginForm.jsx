import React from 'react'
import { Box, Grid } from '@mui/material'
import AdminSignin from './AdminSignin'
import MainLayout from '@/components/Layout/MainLayout';
import styles from '@/pages/Auth/Auth.module.css'

const AdminLoginForm = () => {
  return (
    <div className={styles.auth} >
    <MainLayout>
      <Box
        sx={{
          width: {
            sm: '90vw',
            xs: '90vw',
            md: '60vw',
            lg: '60vw',
            xl: '60vw'
          },
          margin: '0 auto',
          marginTop: 10,
        }}
      >
        {/* GRID SYSTEM */}
        <Grid
          container
          height='90vh'
          justifyContent='center'
          alignItems='center'
        >
          <AdminSignin />
        </Grid>
        {/* GRID SYSTEM END */}
      </Box>
    </MainLayout>
    </div>
  )
}

export default AdminLoginForm
