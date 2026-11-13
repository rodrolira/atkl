import React, { memo } from 'react';
import './Button.css';
import { Link } from 'react-router-dom';
import { safeExternalUrl } from '@/utils/utils';

interface ButtonProps {
  to?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  children?: React.ReactNode
  text?: string
  colorClass?: string
  fontWeight?: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'contained' | 'outlined' | 'text'
  className?: string
  disabled?: boolean
}

const baseClass =
  'flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 lg:h-8 px-4 text-sm leading-normal tracking-[0.015em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white';

const ButtonComponent: React.FC<ButtonProps> = ({
  to,
  onClick,
  children,
  text,
  colorClass = '',
  fontWeight = '',
  type = 'button',
  className = '',
  disabled = false,
}) => {
  const label = <span className="truncate">{text || children}</span>;
  const classes = `${baseClass} ${colorClass} ${fontWeight} ${className}`;

  // Los links de tiendas (Bandcamp, Beatport…) son absolutos: deben salir como
  // <a> real, no como ruta interna del router. Las rutas internas ("/releases")
  // siguen usando <Link>.
  const isAbsolute = !!to && /^(https?:)?\/\//i.test(to);
  const externalUrl = isAbsolute ? safeExternalUrl(to) : null;

  return (
    <div className="mx-auto flex justify-center">
      {externalUrl ? (
        <a href={externalUrl} target="_blank" rel="noopener noreferrer" className={classes}>
          {label}
        </a>
      ) : to ? (
        <Link to={to} className={classes}>
          {label}
        </Link>
      ) : (
        <button type={type} onClick={onClick} disabled={disabled} className={classes}>
          {label}
        </button>
      )}
    </div>
  );
};

export default memo(ButtonComponent);
