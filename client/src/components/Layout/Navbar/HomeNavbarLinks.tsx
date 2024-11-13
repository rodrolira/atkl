import React, { useState, useEffect } from 'react';
import NavItem from './NavItem';
import { useTranslation } from 'react-i18next';
import links from '@/utils/navbarLinks';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useLocation } from 'react-router-dom';

const HomeNavbarLinks: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();
  const location = useLocation();

  const [activeItem, setActiveItem] = useState(location.pathname);

  const handleItemClick = (id: string, to: string) => {
    setActiveItem(to);

    if (id) {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location]);

  return (
    <div className="flex items-center h-full w-full justify-end">
      <div className="hidden lg:flex xs:flex md:block md:w-auto md:order-1">
        <div className="flex items-center justify-center w-full">
          <ul className="items-center justify-center text-lg text-green-50 font-semibold flex p-0 w-full space-x-3 sm:space-x-4 rtl:space-x-reverse md:space-x-6 lg:space-x-8 xl:space-x-10 flex-row mt-0">
            {links.map((link) => {
              const showLink = link.authRequired ? adminAuthenticated : true;

              return (
                showLink && (
                  <NavItem
                    key={link.to}
                    to={link.id}
                    text={t(`navbar.${link.id}`)}
                    isActive={activeItem === link.to}
                    onClick={() => handleItemClick(link.id, link.to)}
                  />
                )
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomeNavbarLinks;
