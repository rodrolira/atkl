import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'flowbite-react';
import React from 'react';

interface ArtistImageProps {
  image: string;
  alt: string;
  adminAuthenticated: boolean;
  openEditModal: () => void;
}

const ArtistImage: React.FC<ArtistImageProps> = ({ image, alt, adminAuthenticated, openEditModal }) => (
  <div className="relative p-4 pb-0 rounded-lg">
    {adminAuthenticated && (
      <Button
        color="transparent"
        type="button"
        onClick={openEditModal}
        aria-label="Edit Artist"
        className="absolute top-2 right-12 text-gray-400 hover:text-yellow-500 p-2"
      >
        <FontAwesomeIcon icon={faEdit} size="xl" />
      </Button>
    )}

    {adminAuthenticated && (
      <Button
        color="transparent"
        type="button"
        aria-label="Delete Artist"
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-2"
      >
        <FontAwesomeIcon icon={faTrash} size="xl" />
      </Button>
    )}

    <img className="rounded-t-lg" src={image} alt={alt} />
  </div>
);

export default ArtistImage;
