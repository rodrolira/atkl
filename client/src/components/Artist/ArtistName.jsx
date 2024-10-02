import React from 'react';

const ArtistName = ({
  name,
  textSize = 'text-2xl',
  adminAuthenticated,
  openEditModal,
}) => (
  <div className="flex items-center justify-center w-full">
    <h1 className={`${textSize} font-bold`}>{name}</h1>
  </div>
);

export default ArtistName;
