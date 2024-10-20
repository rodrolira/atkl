import React from 'react';

interface LogoProps {
  isAdminSignin?: boolean; // Optional prop
  alt: string;
}

const Logo: React.FC<LogoProps> = ({ isAdminSignin }) => {
  return (
    <a
      href="/"
      className={`flex md:justify-start justify-center items-center w-full h-full ${
        isAdminSignin ? 'admin-signin' : ''
      }`}
    >
      <img
        alt="ATKL Records logo"
        src="/logo.jpg"
        className={`max-w-full max-h-full object-contain invert ${
          isAdminSignin ? 'w-full h-full' : 'md:mx-0'
        }`}
      />
    </a>
  );
};

export default Logo;
