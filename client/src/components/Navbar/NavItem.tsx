import React, { memo, useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';

interface NavItemProps {
  linkId: string; // The ID of the section to scroll to
  to: string; // The URL to navigate to
  text: string;
  isActive: boolean;
  handleItemClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ linkId, text, isActive, to, handleItemClick }) => {
  const location = useLocation();
  const history = useHistory();
  const isHomePage = location.pathname === '/';

  const handleClick = useCallback((event: React.MouseEvent) => {
    event.preventDefault();

    setTimeout(() => {
      if (isHomePage) {
        const section = document.getElementById(linkId);
        if (linkId !== 'home' && section) {
          section.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        history.push(to);
      }
    }, 0);

    handleItemClick();
  }, [handleItemClick, history, isHomePage, linkId, to]);

  return (
    <li>
      <Link
        to={to}
        onClick={handleClick}
        className={`nav-link block xl:text-2xl lg:text-xl md:text-lg rounded ${isActive ? 'text-green-700' : 'text-white text-shadow'
          } hover:bg-gray-700 hover:text-green-600 md:hover:bg-transparent border-gray-700`}
        aria-current={isActive ? 'page' : undefined}
      >
        {text}
      </Link>
    </li>
  );
};

// Wrap with React.memo to prevent unnecessary re-renders
export default memo(NavItem);
