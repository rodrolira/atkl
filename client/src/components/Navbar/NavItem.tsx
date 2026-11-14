import React, { memo, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavItemProps {
  /** Id de la sección del Home, cuando el destino es un ancla. */
  linkId: string;
  to: string;
  text: string;
  isActive: boolean;
}

/**
 * Link del navbar de escritorio.
 *
 * El activo se marca con el color de acento, no con gris como antes: el gris
 * es el mismo token que usa el texto atenuado y no se leía como "estás acá".
 * El rojo sobre el fondo da 4,23:1, por debajo del 4,5:1 de texto normal pero
 * por encima del 3:1 que aplica acá, porque estos links son texto grande
 * (18px en adelante y en negrita).
 */
const NavItem: React.FC<NavItemProps> = ({ linkId, text, isActive, to }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const esSeccion = to.startsWith('/#');

  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      if (!esSeccion) return; // navegación normal: que la maneje el router

      event.preventDefault();
      if (location.pathname === '/') {
        document.getElementById(linkId)?.scrollIntoView({ behavior: 'smooth' });
        // El hash queda en la URL para que el activo sobreviva a un refresh.
        navigate(to, { replace: true });
      } else {
        navigate(to);
      }
    },
    [esSeccion, location.pathname, linkId, navigate, to]
  );

  return (
    <li>
      <Link
        to={to}
        onClick={handleClick}
        aria-current={isActive ? 'page' : undefined}
        className={`nav-link relative block rounded px-1 py-2 uppercase tracking-wider
          md:text-lg lg:text-xl xl:text-2xl
          transition-colors duration-200
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
          focus-visible:outline-accent
          ${isActive ? 'text-accent' : 'text-text hover:text-accent'}`}
      >
        {text}
        {/* Subrayado que crece desde la izquierda. Marca el activo con algo más
            que color, para quien no distingue el rojo del blanco. */}
        <span
          aria-hidden="true"
          className={`absolute -bottom-0.5 left-1 h-[2px] bg-accent
            transition-[width] duration-300 ease-[cubic-bezier(0.2,0,0,1)]
            motion-reduce:transition-none
            ${isActive ? 'w-[calc(100%-0.5rem)]' : 'w-0'}`}
        />
      </Link>
    </li>
  );
};

export default memo(NavItem);
