import React from "react";

interface TitleProps {
  children: React.ReactNode; // Prop children
  className?: string; // Prop className opcional
}

const Title: React.FC<TitleProps> = React.memo(({ children, className = 'text-white' }) => {
  return (
    <h2
      className={`text-4xl mx-auto z-50 font-bold my-4 sm:mt-12 text-center ${className}`}
    >
      {children}
    </h2>
  );
});

export default Title;
