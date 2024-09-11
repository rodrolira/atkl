// NavItem.js
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const NavItem = ({ to, text, isActive, onClick }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const isHomePage = location.pathname === '/'

  const handleClick = (event) => {
    event.preventDefault() // Prevents the default anchor click behavior

    if (isHomePage) {
      // If on Home page, scroll to the section
      onClick(to)
    } else {
      // If on other pages, navigate to the route
      navigate(to)
    }
  }

  return (
    <li>
      <a
        href={to}
        className={`block xl:text-xl lg:text-[100%] md:text-xs rounded ${isActive ? 'text-green-700' : 'text-white'
          } hover:bg-gray-700 hover:text-green-600 md:hover:bg-transparent border-gray-700`}
        aria-current={isActive ? 'page' : undefined}
        onClick={handleClick}
      >
        {text}
      </a>
    </li>
  )
}

export default NavItem
