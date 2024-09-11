import React from 'react';
import NavbarMenu from './NavbarMenu';
import NavbarMenuMobile from './NavbarMenuMobile';
import Logo from '@/components/atoms/Logo/Logo';
import styles from './Navbar.module.css';

function Navbar() {
  return (
    <nav className={`${styles.navbarWrapper} shadow-lg h-20 lg:h-24 z-10`}>
      <div className="relative h-full w-full md:flex">
        <div className="absolute top-0 right-0 h-full flex items-center me-4">
          <NavbarMenuMobile />
        </div>

        {/* Contenedor del logo que ocupa todo el ancho */}
        <div className="flex justify-center h-full mx-2">
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
