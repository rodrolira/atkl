import React from 'react';
import {Link} from 'react-router-dom';

const ArtistName = ({
  name,
  id,
  textSize = 'text-2xl',
  adminAuthenticated,
  openEditModal,
}) => (
  <Link to={`/artists/${id}`} className="flex items-center justify-center w-full">
    <h1 className={`${textSize} font-bold`}>{name}</h1>
  </Link>
);

export default ArtistName;
