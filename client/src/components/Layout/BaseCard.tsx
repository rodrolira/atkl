import React, { ReactNode } from 'react';

interface BaseCardProps {
  children: ReactNode;
  className?: string;
}

const BaseCard: React.FC<BaseCardProps> = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-black max-w-sm border border-gray-200 rounded-lg shadow dark:border-green-500 relative ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default BaseCard;
