// eslint-disable-next-line no-unused-vars
import React from 'react'
import Button from './Button'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'

const DemoButton = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()

    const handleButtonClick = () => {
        if (location.pathname !== '/') {
            navigate('/', { state: { scrollToDemos: true } })

            setTimeout(() => {
                const demosSection = document.getElementById('demos')
                if (demosSection) {
                    demosSection.scrollIntoView({ behavior: 'smooth' })
                }
            }, 100)
        } else {
            const demosSection = document.getElementById('demos')
            if (demosSection) {
                demosSection.scrollIntoView({ behavior: 'smooth' })
            }
        }
    }

    return (
        <div className="sm:h-full  md:block lg:h-[60%] xl:h-auto cursor-pointer">
            <Button colorClass='bg-[#22581d] text-white'
                onClick={handleButtonClick}
                className="justify-center sm:w-32 md:w-auto lg:text-sm md:text-xs h-full md:font-normal lg:font-bold bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 px-5 md:m-0 lg:mx-2 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 md:order-2"
            >
                {t('send_demo')}
            </Button>
        </div>
    )
}

export default DemoButton
