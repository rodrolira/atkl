// components/organisms/LogoutButton.jsx

import React from 'react'
import Button from './Button'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

import { useTranslation } from 'react-i18next'
// import { Button } from 'flowbite-react'

const AdminLogoutButton = () => {
    const { signout } = useAdminAuth()
    const navigate = useNavigate()
    const { t } = useTranslation()

    const handleLogout = async () => {
        await signout()
        navigate('/')
    }

    return (
        <div className="sm:h-full lg:h-[60%] xl:h-auto cursor-pointer me-1">
            <Button colorClass='bg-[#22581d] text-white'
                className="justify-center lg:text-sm md:text-xs sm:w-32 md:w-auto h-full md:font-normal lg:font-bold focus:ring-4 focus:outline-none md:m-0 lg:mx-2 text-center md:order-2"
                onClick={handleLogout}
            >
                {t('logout')}
            </Button>
        </div>
    )
}

export default AdminLogoutButton
