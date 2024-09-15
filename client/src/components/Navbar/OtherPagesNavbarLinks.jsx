import React, { useState, useEffect } from 'react'
import NavItem from './NavItem'
import { useLocation } from 'react-router-dom'
import { useLanguage } from '@/hooks/useLanguage'
import links from '@/utils/navbarLinks'
// // import { useAdminAuth } from '../../contexts/AdminAuthContext'


const OtherPagesNavbarLinks = () => {
  const { language } = useLanguage()
  const [isNavbarOpen, setNavbarOpen] = useState(false)
  const location = useLocation()
  const [activeItem, setActiveItem] = useState(location.pathname)
  // const { isAuthenticated: adminAuthenticated } = useAdminAuth()

  const handleItemClick = (to) => {
    setNavbarOpen(false)
    setActiveItem(to) // Actualiza el estado activo con la nueva ruta

    if (to === '/') {
      // Scroll to top for home
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Scroll to section
      const sectionId = to.replace('/', '') // Convert the path to an ID
      const section = document.getElementById(sectionId)
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' })
      } else {
        console.error(`No section found with ID: ${sectionId}`)
      }
    }
  }

  useEffect(() => {
    setActiveItem(location.pathname)
  }, [location.pathname])

  return (
    <div className='bg-transparent border-gray-200 w-full h-full relative'>
      <div className='max-w-screen-xl flex flex-1 h-full justify-between mx-auto w-full items-center'>
        <div className='flex items-center h-full w-full justify-end me-4'>
          <div
            className={`${isNavbarOpen ? 'md:hidden absolute top-full w-full' : 'hidden'
              } items-center justify-between lg:flex md:block md:w-auto md:order-1`}
          >
            <div className='max-w-screen-xl mx-auto w-full'>
              <div className='flex items-center justify-center w-full'>
                <ul className='items-center md:bg-transparent bg-gray-700 bg-opacity-75 font-semibold flex flex-col md:p-0 w-full sm:border md:space-x-4 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 border-gray-700'>
                  {links.map(link => {
                    const showLink = link.authRequired
                      ? adminAuthenticated // Mostrar el enlace si el administrador está autenticado
                      : true

                    return (
                      showLink && (
                        <NavItem
                          key={link.to}
                          to={link.to}
                          href={link.to}
                          text={language === 'en' ? link.text_en : link.text_es}
                          isActive={
                            activeItem === link.to ||
                            (link.to === '/' && activeItem === '')
                          }
                          onClick={() => handleItemClick(link.to)}
                        />
                      )
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OtherPagesNavbarLinks
