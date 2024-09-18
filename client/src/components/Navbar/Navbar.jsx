import React from 'react';
import NavbarMenu from './NavbarMenu';
import NavbarMenuMobile from './NavbarMenuMobile';
import Logo from '@/components/atoms/Logo/Logo';
import styles from './Navbar.module.css';
import { AddArtistButton, AddReleaseButton, AdminLogoutButton } from '@/components/Button/CircularButtons';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

function Navbar() {
  const { adminAuthenticated } = useAdminAuth();

  return (
    <nav className={`${styles.navbarWrapper} shadow-lg h-20 lg:h-24 z-10`}>
      <div className="h-full flex items-center">
        {!adminAuthenticated  && (
        <div className="top-0 left-0 xs:hidden sm:flex md:hidden h-full flex items-center w-full ms-4 ">
        <AddArtistButton />
        <AddReleaseButton />
      </div>
        )}
        
        <div className="absolute top-0 right-0 h-full flex md:hidden items-center">
          <NavbarMenuMobile />
          {!adminAuthenticated && (
          <AdminLogoutButton />
          )}
        </div>

        {/* Contenedor del logo que ocupa todo el ancho */}
        <div className={`${styles.navbarLogoWrapper} justify-center hidden sm:flex h-full mx-2 dark:invert`}>
          {/* <div className='w-full md:w-auto flex justify-center md:justify-start'> */}
          <Logo alt="Company Logo" />
          {/* </div> */}
        </div>

        {/* Menú de navegación (para pantallas grandes) */}
        <NavbarMenu />
      </div>
    </nav>
  );
}

export default Navbar;
