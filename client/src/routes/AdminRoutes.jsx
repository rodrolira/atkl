import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AdminDashboard from '@/pages/Admin/AdminDashboard';
// import AdminReleases from '@/pages/Admin/AdminReleases';
// import AdminArtists from '@/pages/Admin/AdminArtists';


const AdminRoutes = () => {
  return (
    <Switch>
      <Route exact path="/admin" component={AdminDashboard} />
      {/* <Route path="/admin/releases" component={AdminReleases} />
      <Route path="/admin/artists" component={AdminArtists} /> */}
    </Switch>
  );
};

export default AdminRoutes;
