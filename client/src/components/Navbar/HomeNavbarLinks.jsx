import React, { useState } from 'react'
import NavItem from './NavItem'
import { useLanguage } from '@/hooks/useLanguage'
import links from '@/utils/navbarLinks'
// // import { useAdminAuth } from '../../contexts/AdminAuthContext'


const HomeNavbarLinks = () => {
    const { language } = useLanguage()
    // const { isAuthenticated: adminAuthenticated } = useAdminAuth()

    const [activeItem, setActiveItem] = useState('/') // Inicialmente ningún ítem está activo

    const handleItemClick = (id) => {
        setActiveItem(id) // Actualiza el estado activo con la nueva ruta

        // Scroll to section if it is an internal section
        if (id) {
            const section = document.getElementById(id)
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' })
            }
        }
    }

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
                                            (link.id === 'main' &&
                                                activeItem === '')
                                        } // Verifica si el enlace es 'Home' y si el estado activo está vacío
                                        onClick={() => handleItemClick(link.id)}
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
