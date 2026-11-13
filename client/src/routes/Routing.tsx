import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '@/pages/Home/Home';
import AboutPage from '@/pages/About/AboutPage';
import ArtistsPage from '@/pages/Artist/ArtistsPage';
import ArtistPage from '@/pages/Artist/ArtistPage';
import ReleasesPage from '@/pages/Release/ReleasesPage';
import NotFound from '@/pages/NotFound';
import Loading from '@/components/atoms/Loading/Loading';

// El panel de administración y los formularios de sesión los ve una sola
// persona, pero viajaban en el mismo bundle que la portada. Se cargan al
// entrar a su ruta. Las páginas públicas quedan en carga directa a propósito:
// diferirlas solo agregaría un parpadeo en la primera pintura.
//
// Nota: esto divide por ruta, no por librería. El intento anterior de separar
// por librería (manualChunks en vite.config) dejaba React en un chunk distinto
// del de los paquetes que leen sus internals y rompía la página entera.
const Login = React.lazy(() => import('@/pages/Auth/Login'));
const Register = React.lazy(() => import('@/pages/Auth/Register'));
const LoginAdminPage = React.lazy(() => import('@/pages/Auth/LoginAdminPage'));
const AdminDashboard = React.lazy(() => import('@/pages/Admin/AdminDashboard'));

import { useAdminAuth } from '@/contexts/AdminAuthContext';

const Routing: React.FC = React.memo(() => {
  const { isAuthenticated: adminAuthenticated, loading: adminLoading } = useAdminAuth();

  return (
    <Suspense fallback={<Loading />}>
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
    </Suspense>
  );
});

export default Routing;
