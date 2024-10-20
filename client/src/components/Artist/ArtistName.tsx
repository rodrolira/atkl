import React from 'react';
import { Link } from 'react-router-dom';

interface ArtistNameProps {
  name: string;
  id: number;
  textSize?: string;
  adminAuthenticated: boolean;
  openEditModal: () => void;
}

const ArtistName: React.FC<ArtistNameProps> = ({
  name,
  id,
  textSize = 'text-2xl',
}) => (
  <Link to={`/artists/${id}`} className="flex items-center justify-center w-full hover:text-green-500">
    <h1 className={`${textSize} font-bold`}>{name}</h1>
  </Link>
);

export default ArtistName;
