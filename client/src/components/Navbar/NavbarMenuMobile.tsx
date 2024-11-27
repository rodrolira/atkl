import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import LanguageMenu from '@/components/Language/LanguageMenu';
import links from '@/utils/navbarLinks';
import './NavbarMenuMobile.css';
import DemoButton from '@/components/Button/DemoButton';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Link } from 'react-router-dom';

const NavbarMenuMobile: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (id: string, to: string) => {
    setIsOpen(false); // Close the menu when an item is clicked
    if (id) {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.warn(`No section found with ID: ${id}`);
      }
    }
  };

  return (
    <>
      <div className="flex items-center">
        <div className="sm:me-2 z-30 relative">
          <LanguageMenu /> 
        </div>
        <div>
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
                    <button 
                      onClick={() => handleItemClick(link.id, link.to)} 
                      className="menu-link"
                    >
                      {t(`navbar.${link.id}`)}
                    </button>
                    {index !== links.length - 1 && (
                      <hr className="border-t-2 border-green-600 overflow-hidden" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
});

export default React.memo(NavbarMenuMobile);
