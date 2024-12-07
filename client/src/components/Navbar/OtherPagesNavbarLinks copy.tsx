import React, { useState } from 'react';
import NavItem from './NavItem';
import links from '@/utils/navbarLinks';
import { useTranslation } from 'react-i18next';

const OtherPagesNavbarLinks: React.FC = () => {
  const { t } = useTranslation();

  const [activeItem, setActiveItem] = useState('/');

  return (
    <div className="flex items-center h-full w-full justify-end">
      <ul className="flex items-center space-x-3">
        {links.map((link) => (
          <NavItem
            key={link.to}
            to={link.id}
            text={t(`navbar.${link.id}`)}
            isActive={
              activeItem === link.to ||
              (link.to === '/' && activeItem === '')
            }
            onClick={() => handleItemClick(link.to)}          />
        ))}
      </ul>
    </div>
  );
};

export default OtherPagesNavbarLinks;
