import React, { useState, useEffect } from 'react'
import NavItem from './NavItem'
import { useTranslation } from 'react-i18next' // Importamos useTranslation de i18next
import links from '@/utils/navbarLinks'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { useLocation } from 'react-router-dom';

const HomeNavbarLinks = () => {
    const { t } = useTranslation(); // Usamos el hook useTranslation
    const { isAuthenticated: adminAuthenticated } = useAdminAuth();
    const location = useLocation();

    // Inicialmente activamos según la ruta actual
    const [activeItem, setActiveItem] = useState(location.pathname);

    const handleItemClick = (id, linkTo) => {
        // Si hacemos clic en otro link que no es el home, desactivamos home
        setActiveItem(linkTo); // Actualizamos el enlace activo

        // Hacemos scroll a la sección si es un enlace interno (sección)
        if (id) {
            const section = document.getElementById(id);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    useEffect(() => {
        // Actualiza el `activeItem` cuando cambia la ruta
        setActiveItem(location.pathname);
    }, [location]);

    return (
        <div className="flex items-center h-full w-full justify-end">
            <div className="hidden lg:flex xs:flex md:block md:w-auto md:order-1">
                <div className="flex items-center justify-center w-full">
                    <ul className="items-center justify-center text-lg text-green-50 font-semibold flex p-0 w-full space-x-3 sm:space-x-4 rtl:space-x-reverse md:space-x-6 lg:space-x-8 xl:space-x-10 flex-row mt-0">
                        {links.map((link) => {
                            const showLink = link.authRequired
                                ? adminAuthenticated // Muestra el enlace si el admin está autenticado
                                : true;

                            return (
                                showLink && (
                                    <NavItem
                                        key={link.to}
                                        to={link.id} // Pasa solo el ID del enlace
                                        href={link.to}
                                        text={t(`navbar.${link.id}`)} // Usa `t` para la traducción basada en las claves
                                        isActive={
                                            activeItem === link.to // Verifica si el enlace está activo
                                        } 
                                        onClick={() => handleItemClick(link.id, link.to)}
                                    />
                                )
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default HomeNavbarLinks;
