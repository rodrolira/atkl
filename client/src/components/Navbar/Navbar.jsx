import React from 'react';
import NavbarMenu from './NavbarMenu';
import NavbarMenuMobile from './NavbarMenuMobile';
import Logo from '@/components/atoms/Logo/Logo';
import styles from './Navbar.module.css';
import { AddArtistButton, AddReleaseButton, AdminLogoutButton } from '@/components/Button/CircularButtons';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

function Navbar() {
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();

  return (
    <nav className={`${styles.navbarWrapper} shadow-lg h-20 lg:h-24 z-10 py-1`}>
      <div className="h-full flex items-center">
        {/* Contenedor del logo que ocupa todo el ancho */}
        <div className={`${styles.navbarLogoWrapper} justify-center flex w-[50%] h-full ms-2 sm:mx-2 dark:invert`}>
          {/* <div className='w-full md:w-auto flex justify-center md:justify-start'> */}
          <Logo alt="Company Logo" />
          {/* </div> */}
        </div>
        <div className="h-full w-full flex md:hidden flex-col items-end">
          {adminAuthenticated && (
            <div className="h-full flex md:hidden w-full justify-end xs:justify-start items-center">
              <AddArtistButton />
              <AddReleaseButton />
              <div className='relative xs:absolute right-0'>
              <AdminLogoutButton />
              </div>
            </div>
          )}

          <div className="xs:absolute top-0 right-0 xs:right-10 h-full flex md:hidden items-center">
            <NavbarMenuMobile />
          </div>
        </div>


        {/* Menú de navegación (para pantallas grandes) */}
        <NavbarMenu />
      </div>
    </nav>
  );
}

export default Navbar;
