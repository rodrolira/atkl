import React, { memo } from 'react';
import PropTypes from 'prop-types';
import './Button.css';
import { Link } from 'react-router-dom';

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

const ButtonComponent: React.FC<ButtonProps> = memo(({ to, onClick, children, text, colorClass, fontWeight }) => (
  <div className="mx-auto flex justify-center">
    {to ? (
      <Link
        to={to}
        rel="noopener noreferrer"
        className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 lg:h-8 px-4 text-sm leading-normal tracking-[0.015em] ${colorClass} ${fontWeight}`}
      >
        <span className="truncate">{text || children}</span>
      </Link>
    ) : (
      <button
        onClick={onClick}
        className={`flex  max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 lg:h-8 px-4 text-sm leading-normal tracking-[0.015em] ${colorClass} ${fontWeight}`}
      >
        <span className="truncate">{text || children}</span>
      </button>
    )}
  </div>
))

ButtonComponent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  to: PropTypes.string,
  onClick: PropTypes.func,
  text: PropTypes.string,
  colorClass: PropTypes.string,
  fontWeight: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
  disabled: PropTypes.bool,
};


const Button = memo(ButtonComponent);


export default memo(ButtonComponent)
