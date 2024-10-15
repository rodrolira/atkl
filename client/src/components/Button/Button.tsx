import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';
import { Link } from 'react-router-dom';

interface ButtonProps {
  to?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  text?: string;
  colorClass?: string;
  fontWeight?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  className?: string;
  disabled?: boolean;
}

const Button = ({ to, onClick, children, text, colorClass, fontWeight }: ButtonProps) => (
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
);

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  to: PropTypes.string,
  onClick: PropTypes.func,
  text: PropTypes.string,
  colorClass: PropTypes.string,
  fontWeight: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;
