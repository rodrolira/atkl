import React, { useState, useEffect } from 'react'
import NavItem from './NavItem'
import { useLanguage } from '@/hooks/useLanguage'
import links from '@/utils/navbarLinks'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { useLocation } from 'react-router-dom';


const HomeNavbarLinks = () => {
    const { language } = useLanguage()
    const { isAuthenticated: adminAuthenticated } = useAdminAuth()
    const location = useLocation();

    // Inicialmente activamos según la ruta actual
    const [activeItem, setActiveItem] = useState(location.pathname === '/' ? '/' : '');

    const handleItemClick = (id, linkTo) => {
        // Si hacemos clic en otro link que no es el home, desactivamos home
        if (linkTo !== '/') {
            setActiveItem(id); // Actualizamos con el ID de la sección
        } else {
            setActiveItem('/'); // Si es Home, mantenemos la ruta "/"
        }

        // Scroll to section if it is an internal section
        if (id) {
            const section = document.getElementById(id)
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' })
            }
        }
    }

    useEffect(() => {
        // Actualiza el activeItem cuando cambia la ruta
        setActiveItem(location.pathname === '/' ? '/' : '');
    }, [location]);

    return (
        <div className="flex items-center h-full w-full justify-end">
            <div className="hidden lg:flex xs:flex md:block md:w-auto md:order-1">
                <div className="flex items-center justify-center w-full">
                    <ul className="items-center justify-center text-lg text-green-50 font-semibold flex p-0 w-full space-x-3 sm:space-x-4 rtl:space-x-reverse md:space-x-6 lg:space-x-8 xl:space-x-10 flex-row mt-0">
                        {links.map((link) => {
                            const showLink = link.authRequired
                                ? adminAuthenticated // Muestra el enlace si el admin está autenticado
                                : true

                            return (
                                showLink && (
                                    <NavItem
                                        key={link.to}
                                        to={link.id} // Pasa solo el ID del enlace
                                        href={link.to}
                                        text={
                                            language === 'en'
                                                ? link.text_en
                                                : link.text_es
                                        } // Usa el estado del idioma para determinar el texto del enlace
                                        isActive={
                                            activeItem === link.id ||
                                            (link.to === '/' &&
                                                activeItem === '/')
                                        } // Activa el enlace 'Home' si estamos en '/'
                                        onClick={() => handleItemClick(link.id, link.to)}
                                    />
                                )
                            )
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default HomeNavbarLinks
