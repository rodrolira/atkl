import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'react-i18next'; // Importamos useTranslation
import LanguageMenu from '@/components/Language/LanguageMenu';
import links from '@/utils/navbarLinks'; // Importa el array de links
import './NavbarMenuMobile.css'; // Estilos
import DemoButton from '../Button/DemoButton';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

function NavbarMenuMobile() {
  const { t } = useTranslation(); // Usamos el hook de traducción
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
        {/* Menu de idioma */}
        <div>
          <LanguageMenu />
        </div>
        <div>
          {/* Botón de menú hamburguesa */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleMenu}
            className="menu-button"
          >
            {isOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>

          {/* Menú desplegable */}
          {isOpen && (
            <div className="menu-content">
              <ul className="menu-list">
                {/* Mapeo de los links */}
                {links.map((link) => (
                  <li key={link.id}>
                    <a href={link.to} className="menu-link">
                      {t(`navbar.${link.id}`)}{' '}
                      {/* Usamos t() para obtener la traducción */}
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
}

export default NavbarMenuMobile;
