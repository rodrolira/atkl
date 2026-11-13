import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '@/pages/Home/Home';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import AboutPage from '@/pages/About/AboutPage';
import ArtistsPage from '@/pages/Artist/ArtistsPage';
import ArtistPage from '@/pages/Artist/ArtistPage';
import ReleasesPage from '@/pages/Release/ReleasesPage';
import LoginAdminPage from '@/pages/Auth/LoginAdminPage';
import AdminDashboard from '@/pages/Admin/AdminDashboard';
import NotFound from '@/pages/NotFound';
import Loading from '@/components/atoms/Loading/Loading';

import { useAdminAuth } from '@/contexts/AdminAuthContext';

const Routing: React.FC = React.memo(() => {
  const { isAuthenticated: adminAuthenticated, loading: adminLoading } = useAdminAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/artists" element={<ArtistsPage />} />
      <Route path="/artists/:id" element={<ArtistPage />} />
      <Route path="/releases" element={<ReleasesPage />} />
      <Route path="/about" element={<AboutPage />} />
      {/* <Route path='/login' element={<LoginArtistPage />} /> */}
      <Route
        path="/admin/login"
        element={
          adminAuthenticated ? <Navigate to="/" replace /> : <LoginAdminPage />
        }
      />

      <Route path="/login" element={<Login />} />
      {/* Admin Routes: esperamos a que termine la verificación del token para
          no redirigir a login a un admin con sesión válida. */}
      <Route path="/admin" element={
        adminLoading ? (
          <Loading />
        ) : adminAuthenticated ? (
          <AdminDashboard />
        ) : (
          <Navigate to="/admin/login" replace />
        )
      } />
      {/* Redirect to NotFound for unknown paths */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
});

export default Routing;
