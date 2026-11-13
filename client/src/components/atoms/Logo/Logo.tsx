import React, { memo } from 'react';

interface LogoProps {
  isAdminSignin?: boolean; // Optional prop
  alt: string;
}

const Logo: React.FC<LogoProps> = memo(({ isAdminSignin }) => {
  return (
    <a
      href="/"
      className={`flex z-0 md:justify-start justify-center items-center w-full h-full ${
        isAdminSignin ? 'admin-signin' : ''
      }`}
    >
      <img
        alt="ATKL Records logo"
        src="/logo.png"
        // El archivo es verde con fondo transparente. `invert` solo lo volvía
        // magenta — justo la variante que el manual de marca prohíbe
        // ("No cambiar colores"). `brightness-0` lo aplana a silueta negra y
        // el `invert` la pasa a blanca, que es el uso correcto sobre negro.
        className={`max-w-full max-h-full object-contain brightness-0 invert ${
          isAdminSignin ? 'w-full h-full' : 'md:mx-0'
        }`}
      />
    </a>
  );
});

export default Logo;
