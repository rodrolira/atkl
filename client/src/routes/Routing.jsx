import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '@/pages/Home/Home';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import ArtistsPage from '@/pages/Artist/ArtistsPage';
import ArtistPage from '@/pages/Artist/ArtistPage';
import ReleasesPage from '@/pages/Release/ReleasesPage';
import LoginAdminPage from '@/pages/Auth/LoginAdminPage';
import AdminRoutes from './AdminRoutes';
import AdminDashboard from '@/pages/Admin/AdminDashboard';
import EditReleaseModal from '@/components/Release/EditRelease/EditReleaseModal';
import EditArtist from '@/components/Artist/EditArtist/EditArtist';
import NotFound from '@/pages/NotFound';

import { useAdminAuth } from '@/contexts/AdminAuthContext';

function Routing() {
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/artists" element={<ArtistsPage />} />
      <Route path="/releases" element={<ReleasesPage />} />
      <Route path="/artists/:id" element={<ArtistPage />} />
      {/* <Route path='/login' element={<LoginArtistPage />} /> */}
      <Route
        path="/admin/login"
        element={
          adminAuthenticated ? <Navigate to="/admin" /> : <LoginAdminPage />
        }
      />
      {/* Admin Routes */}
      <Route element={<AdminRoutes />}>
        <Route
          path="/admin"
          element={
            adminAuthenticated ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />
        <Route path="/edit-release/:id" element={<EditReleaseModal />} />
        <Route path="/artists/:id/edit" element={<EditArtist />} />
      </Route>
      {/* Redirect to NotFound for unknown paths */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Routing;
