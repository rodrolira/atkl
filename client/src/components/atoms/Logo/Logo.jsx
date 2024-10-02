import React from 'react';

function Logo({ isAdminSignin }) {
  return (
    <a
      href="/"
      className={`flex md:justify-start justify-center items-center w-full h-full ${
        isAdminSignin ? 'admin-signin' : ''
      }`}
    >
      <img
        alt="ATKL Records logo"
        src="/img/main.png"
        className={`max-w-full max-h-full object-contain ${
          isAdminSignin ? 'w-full h-full invert' : 'md:mx-0'
        }`}
      />
    </a>
  );
}

export default Logo;
