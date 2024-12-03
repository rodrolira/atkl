// src/components/Background.tsx
import React from 'react';

const Background: React.FC = React.memo(() => {
  return (
    <div
      className="absolute z-0 inset-0 blur-[118px] max-w-lg lg:h-[80%] max-h-lg h-[800px] mx-auto sm:max-w-3xl sm:h-[400px]"
      style={{
        background:
          'linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(232, 121, 249, 0.26) 56.49%, rgba(79, 70, 229, 0.4) 115.91%)',
      }}
    />
  );
});

export default Background;
