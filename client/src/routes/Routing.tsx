import React, { useMemo } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from '@/pages/Home/Home';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import AboutPage from '@/pages/About/AboutPage';
import ArtistsPage from '@/pages/Artist/ArtistsPage';
import ArtistPage from '@/pages/Artist/ArtistPage';
import ReleasesPage from '@/pages/Release/ReleasesPage';
import LoginAdminPage from '@/pages/Auth/LoginAdminPage';
import AdminRoutes from './AdminRoutes';
import AdminDashboard from '@/pages/Admin/AdminDashboard';
import EditReleaseModal from '@/components/Release/EditRelease/EditReleaseModal';
// import EditArtist from '@/components/Artist/EditArtist';
import NotFound from '@/pages/NotFound';

import { useAdminAuth } from '@/contexts/AdminAuthContext';

const Routing: React.FC = React.memo(() => {
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();

  const memoizedAdminRoutes = useMemo(() => <AdminRoutes />, []);

  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/artists" component={ArtistsPage} />
      <Route path="/releases" component={ReleasesPage} />
      <Route path="/artists/:id" component={ArtistPage} />
      <Route path="/about" component={AboutPage} />
      {/* <Route path='/login' element={<LoginArtistPage />} /> */}
      <Route
        path="/admin/login"
        render={() => (
          adminAuthenticated ? <Redirect to="/" /> : <LoginAdminPage />
        )}
      />

      <Route path="/login" component={Login} />
      {/* Admin Routes */}
      <Route path="/admin">
        <Route
          path="/admin"
          render={() => (
            adminAuthenticated ? (
              <AdminDashboard />
            ) : (
              <Redirect to="/admin/login" />
            )
          )}
        />
        <Route 
          path="/edit-release/:id" 
          render={() => <EditReleaseModal id={0} onClose={() => {}} />} 
        />
      </Route>
      {/* Redirect to NotFound for unknown paths */}
      <Route path="*" component={NotFound} />
    </Switch>
  );
});

export default Routing;
