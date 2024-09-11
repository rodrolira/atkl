// eslint-disable-next-line no-unused-vars
import React from 'react'

// eslint-disable-next-line react/prop-types
function Logo({ isAdminSignin }) {
  const logoClass = isAdminSignin
    ? 'rtl:space-x-reverse flex justify-center items-center mx-auto h-full w-full sm:inline-block '
    : 'rtl:space-x-reverse flex justify-center items-center mx-auto h-full w-full sm:inline-block '

  return (
    <a className={logoClass} href='/'>
      <img
        alt='ATKL Records logo'
        className="h-full absolute md:mx-0 lg:w-1/3 xl:w-1/4 mx-auto"
        src='/img/main.png'
      />
    </a>
  )
}

export default Logo
