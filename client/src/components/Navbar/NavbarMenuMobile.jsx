import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useLanguage } from '@/hooks/useLanguage';
import links from '@/utils/navbarLinks'; // Importa el array de links
import './NavbarMenuMobile.css'; // Estilos

function NavbarMenuMobile() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="navbar-mobile">
      {/* Botón de menú hamburguesa */}
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleMenu}
        className="menu-button"
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}{' '}
        {/* Cambia el icono según el estado */}
      </IconButton>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="menu-content">
          <ul className="menu-list">
            {/* Mapeo de los links */}
            {links.map((link) => (
              <li key={link.id}>
                <a href={link.to} className="menu-link">
                  {language === 'en' ? link.text_en : link.text_es}
                </a>
                <hr />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default NavbarMenuMobile;
