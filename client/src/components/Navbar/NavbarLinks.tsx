import React from 'react';
import OtherPagesNavbarLinks from './OtherPagesNavbarLinks';
import links from '@/utils/navbarLinks';
import HomeNavbarLinks from './HomeNavbarLinks';
import { useLocation } from 'react-router-dom';

const NavbarLinks: React.FC = () => {
  const location = useLocation();

  return (
    <div className="h-[50%] hidden md:flex !md:px-3 xs:px-5">
      {location.pathname === '/' ? (
        <HomeNavbarLinks />
      ) : (
        <OtherPagesNavbarLinks />
      )}
    </div>
  );
};

export default NavbarLinks;