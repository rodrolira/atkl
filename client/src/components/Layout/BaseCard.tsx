import React, { ReactNode } from 'react';

interface BaseCardProps {
  children: ReactNode;
  className?: string;
}

const BaseCard: React.FC<BaseCardProps> = React.memo(({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-black border border-metallic-gray/30 rounded-lg shadow-none z-10 relative ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

export default BaseCard;
