import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface ArtistImageProps {
  imageUrl?: string;
  alt: string;
  adminAuthenticated: boolean;
  openEditModal: () => void;
}

const ArtistImage: React.FC<ArtistImageProps> = ({ imageUrl, alt, adminAuthenticated, openEditModal }) => {
  const finalImageUrl = imageUrl || '/images/placeholder.png';

  return (
    <div className="relative p-4 pb-0 rounded-lg">
      {adminAuthenticated && (
        <button
          type="button"
          onClick={openEditModal}
          aria-label="Edit Artist"
          className="absolute top-2 right-12 text-gray-400 hover:text-yellow-500 p-2"
        >
          <FontAwesomeIcon icon={faEdit} size="xl" />
        </button>
      )}

      <img className="rounded-t-lg w-full" src={finalImageUrl} alt={alt} loading="lazy" />
    </div>
  )
}

export default ArtistImage;
