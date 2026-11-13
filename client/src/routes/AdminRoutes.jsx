import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminDashboard from '@/pages/Admin/AdminDashboard';
// import AdminReleases from '@/pages/Admin/AdminReleases';
// import AdminArtists from '@/pages/Admin/AdminArtists';


const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      {/* <Route path="/releases" element={<AdminReleases />} />
      <Route path="/artists" element={<AdminArtists />} /> */}
    </Routes>
  );
};

export default AdminRoutes;
