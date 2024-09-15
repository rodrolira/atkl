import React from 'react'
import LanguageMenu from '@/components/Language/LanguageMenu'
import DemoButton from '@/components/Button/DemoButton'
import NavbarLinks from './NavbarLinks'
import { useLanguage } from '@/hooks/useLanguage'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

import Button from '@/components/Button/Button'
import AddArtistButton from '@/components/Button/AddArtistButton'
import AddReleaseButton from '@/components/Button/AddReleaseButton'
import AdminLogoutButton from '@/components/Button/AdminLogoutButton'
import { AddArtistButton as AddArtistButtonMobile, AddReleaseButton as AddReleaseButtonMobile, AdminLogoutButton as AdminLogoutButtonMobile } from '../Button/CircularButtons'

function NavbarMenu() {
    const { language } = useLanguage()
    const { isAuthenticated: adminAuthenticated } = useAdminAuth()

    return (
        <div className='xs:flex lg:block hidden xs:flex-row-reverse xs:flex-wrap items-center w-full'>
            <div className='flex items-center justify-end h-[50%] px-2'>
                <div className='z-10 flex divide-y rounded-lg text-center '>
                    <ul
                        className='py-2 text-sm hidden sm:flex text-white dark:text-white sm:font-normal'
                        aria-labelledby='dropdownHoverButton'
                    >
                        {adminAuthenticated && (
                            <>
                                <li className='mx-1'>
                                    <AddArtistButton className='!capitalize'>
                                        {language === 'en'
                                            ? 'Add Artist'
                                            : 'Agregar Artista'}
                                    </AddArtistButton>
                                </li>
                                <li className='mx-1'>
                                    <AddReleaseButton className='btn-add'>
                                        {language === 'en'
                                            ? 'Add Release'
                                            : 'Agregar Lanzamiento'}
                                    </AddReleaseButton>
                                </li>
                                <li className='mx-1'>
                                    <Button href='/admin' className='mx-auto flex justify-center' colorClass='bg-[#22581d] text-white'>
                                        {language === 'en'
                                            ? 'Admin Dashboard'
                                            : 'Panel de Administrador'}
                                    </Button>
                                </li>
                            </>
                        )}
                        {!adminAuthenticated && (
                        <li className='mx-1'>
                            <DemoButton />
                        </li>
                        )} 
                        <LanguageMenu />
                        {adminAuthenticated && (
                            <li className='mx-1'>
                                <AdminLogoutButton />
                            </li>
                        )}
                    </ul>
                </div>
                {adminAuthenticated && (
                    <div className='sm:hidden'>
                        <AddArtistButtonMobile />
                        <AddReleaseButtonMobile />
                        <AdminLogoutButtonMobile />
                    </div>
                )}
            </div>
            <NavbarLinks />
        </div>
    )
}

export default NavbarMenu
