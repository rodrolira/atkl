import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'react-i18next';
import LanguageMenu from '@/components/Language/LanguageMenu';
import links from '@/utils/navbarLinks';
import './NavbarMenuMobile.css';
import DemoButton from '../Button/DemoButton';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const NavbarMenuMobile: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="flex">
        {!adminAuthenticated && (
          <div className="hidden">
            <DemoButton />
          </div>
        )}
        <div>
          <LanguageMenu />
        </div>
        <div>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleMenu}
            className="menu-button"
          >
            {isOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>

          {isOpen && (
            <div className="menu-content">
              <ul className="menu-list">
                {links.map((link) => (
                  <li key={link.id}>
                    <a href={link.to} className="menu-link">
                      {t(`navbar.${link.id}`)}
                    </a>
                    <hr />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NavbarMenuMobile;
