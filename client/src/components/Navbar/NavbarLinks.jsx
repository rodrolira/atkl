// eslint-disable-next-line no-unused-vars
import React from 'react'
import OtherPagesNavbarLinks from './OtherPagesNavbarLinks'
import links from '@/utils/navbarLinks'
import HomeNavbarLinks from './HomeNavbarLinks'

const NavbarLinks = () => {
  return (
    <div className='h-[50%] hidden md:flex !md:px-3 xs:px-5'>
      {/* Renderiza HomeNavbarLinks solo en la página de inicio */}
      {location.pathname === '/'
        ? (
          <HomeNavbarLinks links={links} />
        )
        : (
          <OtherPagesNavbarLinks links={links} />
        )}
    </div>
  )
}

export default NavbarLinks
