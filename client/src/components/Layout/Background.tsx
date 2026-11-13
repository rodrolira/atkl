// src/components/Background.tsx
import React from 'react';

const Background: React.FC = React.memo(() => {
  return (
    <div
      className="absolute z-0 inset-0 blur-[118px] max-w-lg lg:h-[80%] max-h-lg h-[800px] mx-auto sm:max-w-3xl sm:h-[400px]"
      style={{
        background:
          'linear-gradient(106.89deg, rgba(26, 26, 26, 0.15) 15.73%, rgba(42, 42, 42, 0.1) 15.74%, rgba(74, 74, 74, 0.08) 56.49%, rgba(154, 154, 154, 0.05) 115.91%)',
      }}
    />
  );
});

export default Background;
