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
    <nav className={`${styles.navbarWrapper} shadow-lg min-h-16  sm:min-h-20 xs:min-h-12 lg:h-24 border-b-2 border-b-green-600 `} style={{ zIndex: 1000 }}>
      <div className="h-full flex items-center ">
        {/* Contenedor del logo que ocupa todo el ancho */}
        <div
          className={`${styles.navbarLogoWrapper} justify-center flex sm:w-[50%] w-full h-24 !ms-6 sm:mx-2`}
        >
          <Logo alt="Company Logo" />
        </div>
        {adminAuthenticated && (
          <div className="h-full flex md:hidden xs:hidden w-full justify-end sm:flex xs:justify-start items-center me-3">
            <AddArtistButton />
            <AddReleaseButton />
            <div className="relative right-0 xs:me-3">
              <AdminLogoutButton />
            </div>
          </div>
        )}

        <div className="md:hidden me-3 flex s  w-full">
          <NavbarMenuMobile />
        
        </div>

        {/* Menú de navegación (para pantallas grandes) */}
        <NavbarMenu isDialogOpen={false} handleClose={() => { }} handleArtistAdded={() => { }} />
      </div>
    </nav>
  );
};

export default Navbar;
