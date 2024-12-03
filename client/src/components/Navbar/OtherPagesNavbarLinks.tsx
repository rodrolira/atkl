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
    <div className="bg-transparent border-gray-200 w-full h-full relative">
      <div className="max-w-screen-xl flex flex-1 h-full justify-between mx-auto w-full items-center">
        <div className="flex items-center h-full w-full justify-end me-4">
          <div
            className={`${
              isNavbarOpen ? 'md:hidden absolute top-full w-full' : 'hidden'
            } items-center justify-between lg:flex md:block md:w-auto md:order-1`}
          >
              <div className="flex items-center justify-center w-full">
                <ul className="items-center justify-center text-lg md:bg-transparent bg-gray-700 bg-opacity-75 font-semibold flex flex-col md:p-0 w-full sm:border md:space-x-6 space-x-3 sm:space-x-4 lg:space-x-8 xl:space-x-10  rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 border-gray-700">
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
      </div>
    </div>
  );
};

export default React.memo(OtherPagesNavbarLinks);
