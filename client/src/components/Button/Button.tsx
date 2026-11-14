import React, { memo } from 'react';
import './Button.css';
import { Link } from 'react-router-dom';
import { safeExternalUrl } from '@/utils/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  to?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  children?: React.ReactNode
  text?: string
  variant?: ButtonVariant
  /**
   * Escape hatch heredado: pisa las clases de color de la variante. Queda para
   * los sitios que todavía no se migraron; en código nuevo usar `variant`.
   */
  colorClass?: string
  fontWeight?: string
  type?: 'button' | 'submit' | 'reset'
  className?: string
  disabled?: boolean
}

// min-h-11 = 44px, el mínimo de área táctil accesible. El anillo de foco usa el
// token de texto y no el acento: sobre un botón rojo un anillo rojo no se ve.
const baseClass = [
  'inline-flex min-h-11 min-w-[84px] max-w-[480px] items-center justify-center',
  'cursor-pointer overflow-hidden rounded-full px-5',
  'text-sm font-semibold uppercase leading-normal tracking-[0.1em]',
  'transition-[background-color,border-color,color,transform] duration-200',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
  'focus-visible:outline-text',
  'active:scale-95',
  'disabled:pointer-events-none disabled:opacity-40 disabled:active:scale-100',
].join(' ');

const VARIANTS: Record<ButtonVariant, string> = {
  // Rojo de la marca con texto blanco: 4,97:1, pasa AA para texto normal en
  // los dos modos. pure-white y no el token, porque el fondo es rojo siempre.
  primary: 'bg-accent text-pure-white border border-accent hover:bg-accent-hover hover:border-accent-hover',
  // Contorno gris que vira al acento. El umbral acá es 3:1 (borde, no texto).
  secondary: 'bg-transparent text-text border border-muted/60 hover:border-accent hover:text-accent',
  // Sin caja hasta que se interactúa.
  ghost: 'bg-transparent text-muted border border-transparent hover:text-accent hover:bg-accent/10',
};

const ButtonComponent: React.FC<ButtonProps> = ({
  to,
  onClick,
  children,
  text,
  variant = 'primary',
  colorClass = '',
  fontWeight = '',
  type = 'button',
  className = '',
  disabled = false,
}) => {
  const label = <span className="truncate">{text || children}</span>;
  // Si llega colorClass, manda esa: es el escape hatch de los call sites viejos.
  const variantClass = colorClass || VARIANTS[variant];
  const classes = `${baseClass} ${variantClass} ${fontWeight} ${className}`;

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
