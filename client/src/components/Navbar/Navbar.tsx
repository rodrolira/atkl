import React from 'react';
import NavbarMenu from './NavbarMenu';
import NavbarMenuMobile from './NavbarMenuMobile';
import Logo from '@/components/atoms/Logo/Logo';
import styles from './Navbar.module.css';
import {
  AddArtistButton,
  AddReleaseButton,
  AdminLogoutButton,
} from '@/components/Button/CircularButtons';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();

  return (
    <nav
      className={`${styles.navbarWrapper} shadow-lg min-h-16  sm:min-h-20 xs:min-h-12 lg:h-24 border-b-2 border-b-green-600`}
      style={{ zIndex: 1000 }}
    >
      <div className="h-full flex items-center justify-between">
        {/* Logo occupies full width in mobile view */}
        <div
          className={`${styles.navbarLogoWrapper} flex h-full items-center justify-start w-1/3 sm:justify-center p-2`}
        >
          <Logo alt="Company Logo" />
        </div>

        {/* Circular buttons container */}
        <div className="flex md:hidden flex-col h-full w-auto sm:w-1/2 sm:flex-row sm:justify-end px-2">
          {adminAuthenticated && (

            <div className="flex md:hidden items-center justify-center space-x-2 sm:space-x-4 flex-grow h-1/2">
              <AddArtistButton />
              <AddReleaseButton />
              <AdminLogoutButton />
            </div>
          )}

          {/* Navbar menu for mobile view */}
          <div className="w-full flex items-center justify-end h-1/2 sm:hidden">
            <NavbarMenuMobile />
          </div>
        </div>

        {/* Navbar menu for larger screens */}
        <div className="hidden md:flex md:flex-row w-auto">
          <NavbarMenu isDialogOpen={false} handleClose={() => { }} handleArtistAdded={() => { }} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
