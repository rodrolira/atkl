import React from 'react'
import { Box, Grid } from '@mui/material'
import AdminSignin from './AdminSignin'
import MainLayout from '../Template/MainLayout';

const AdminLoginForm = () => {
  return (
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
  )
}

export default AdminLoginForm
