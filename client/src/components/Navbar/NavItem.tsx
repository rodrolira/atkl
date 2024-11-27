import React, { memo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface NavItemProps {
  linkId: string; // The ID of the section to scroll to
  to: string; // The URL to navigate to
  text: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

const NavItem: React.FC<NavItemProps> = ({ linkId, text, isActive, onClick, to }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault(); // Prevents the default anchor click behavior

    setTimeout(() => {
      if (isHomePage) {
        // If on Home page, scroll to the section
        // Implement your scroll logic here, for example:
        const section = document.getElementById(linkId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
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
        } hover:bg-gray-700 hover:text-green-600 md:hover:bg-transparent border-gray-700`}
        aria-current={isActive ? 'page' : undefined}
        onClick={handleClick}
      >
        {text}
      </Link>
    </li>
  );
};

// Wrap with React.memo to prevent unnecessary re-renders
export default memo(NavItem);
