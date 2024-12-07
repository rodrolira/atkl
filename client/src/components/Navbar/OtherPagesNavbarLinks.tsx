import React, { useState, useEffect, useCallback, useMemo } from 'react';
import NavItem from './NavItem';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import links from '@/utils/navbarLinks';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const OtherPagesNavbarLinks: React.FC = () => {
  const { t } = useTranslation();
  const [isNavbarOpen, setNavbarOpen] = useState<boolean>(false);
  const location = useLocation();
  const [activeItem, setActiveItem] = useState<string>(location.pathname);
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();

  const handleItemClick = useCallback((to: string) => {
    setNavbarOpen(false);
    setActiveItem(to);

    if (to === '/') {
      // Scroll to top for home
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Scroll to section
      const sectionId = to.replace('/', '');
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.error(`No section found with ID: ${sectionId}`);
      }
    }
  }, []);

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  const filteredLinks = useMemo(() => {
    return links.filter(link =>
      link.authRequired ? adminAuthenticated : true
    );
  }, [links, adminAuthenticated]);

  return (

    <div className="flex items-center h-full w-full justify-end">
      <div className="hidden lg:flex xs:flex md:block md:w-auto md:order-1">
        <div className="flex items-center justify-center w-full">

        <ul className="items-center justify-center text-lg text-green-50 font-semibold flex p-0 w-full space-x-3 sm:space-x-4 rtl:space-x-reverse md:space-x-6 lg:space-x-8 xl:space-x-10 flex-row mt-0">
        {filteredLinks.map((link) => (
              <NavItem
                key={link.to}
                to={link.to}
                linkId={link.id}
                text={t(`navbar.${link.id}`)}
                isActive={
                  activeItem === link.to ||
                  (link.to === '/' && activeItem === '')
                }
                handleItemClick={(id) => console.log(`Navigating to: ${id}`)} // Pass the function
              />
            ))}
          </ul>
        </div>
      </div>
    </div>

  );
};

export default React.memo(OtherPagesNavbarLinks);
