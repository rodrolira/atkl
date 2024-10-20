import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
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
      <div className="flex items-end flex-col na">
        <div className="me-4">
          <LanguageMenu /> 
        </div>
        <div className="me-4">
        {!adminAuthenticated && (
          <div className="hidden sm:block">
            <DemoButton />
          </div>
        )}  
        <div className="me-1">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleMenu}
            className="menu-button !bg-green-900 hover:bg-green-500"
            size="small"
          >
            {isOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </div>

          {isOpen && (
            <div className="menu-content border-l-2 border-t-2 border-b-2 border-green-600 rounded-bl-lg z-20 ">
              <ul className="menu-list">
                {links.map((link, index) => (
                  <li key={link.id}>
                    <a href={link.to} className="menu-link ">
                      {t(`navbar.${link.id}`)}
                    </a>
                    {index !== links.length - 1 && <hr className="border-t-2 border-green-600 overflow-hidden" />} {/* Solo agrega el <hr> si no es el último enlace */}
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
