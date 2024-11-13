import { debounce } from '@mui/material';
import React, { memo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface NavItemProps {
  to: string;
  text: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

const NavItem: React.FC<NavItemProps> = memo(({ to, text, isActive, onClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const handleClick = useCallback(
    debounce((event: React.MouseEvent) => {
      event.preventDefault(); // Prevents the default anchor click behavior
      if (isHomePage) {
        // If on Home page, scroll to the section
        onClick(to);
      } else {
        // If on other pages, navigate to the route
        navigate(to);
      }
    }, 100),
    [isHomePage, onClick]
  )



  return (
    <li>
      <Link
        to={to}
        className={`nav-link block xl:text-xl lg:text-xl md:text-lg rounded ${isActive ? 'text-green-700' : 'text-white text-shadow'
          } hover:bg-gray-800 hover:text-green-500 md:hover:bg-transparent border-gray-700`}
        aria-current={isActive ? 'page' : undefined}
        onClick={handleClick}
      >
        {text}
      </Link>
    </li>
  );
});

export default NavItem;
