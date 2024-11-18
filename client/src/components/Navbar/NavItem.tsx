import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface NavItemProps {
  to: string;
  text: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

const NavItem: React.FC<NavItemProps> = ({ to, text, isActive, onClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault(); // Prevents the default anchor click behavior

    setTimeout(() => {

      if (isHomePage) {
        // If on Home page, scroll to the section
        onClick(to);
      } else {
        // If on other pages, navigate to the route
        navigate(to);
      }
    }, 0);
  };

  return (
    <li>
      <Link
        to={to}
        className={`nav-link block xl:text-2xl lg:text-xl md:text-lg rounded ${
          isActive ? 'text-green-700' : 'text-white text-shadow' 
        } hover:bg-gray-700 hover:text-green-600 md:hover:bg-transparent border-gray-700` }
        aria-current={isActive ? 'page' : undefined}
        onClick={handleClick}
      >
        {text}
      </Link>
    </li>
  );
};

export default NavItem;
