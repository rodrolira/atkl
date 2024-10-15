import React from 'react';
import ArtistImage from './ArtistImage';
import ArtistLinks from './ArtistLinks';
import { Artist } from '@/types/interfaces/Artist';


interface ArtistDetailsProps {
  artist: Artist;
  adminAuthenticated: boolean;
  openEditModal: () => void;
}

const ArtistDetails: React.FC<ArtistDetailsProps> = ({ artist, adminAuthenticated, openEditModal }) => {
  const rolesText = artist.Roles && artist.Roles.length > 0
    ? artist.Roles.map((role) => role.label).join(' / ')
    : 'No roles assigned';

  return (
    <div className="sm:w-1/3 sm:px-4 sm:pt-4 sm:border-r border-green-600 text-center text-white">
      <ArtistImage
        image={`http://localhost:3000/${artist.image}`}
        alt={artist.artist_name}
        adminAuthenticated={adminAuthenticated}
        openEditModal={openEditModal}
      />
      <div className="px-4">
        <div className="bg-black w-full h-auto relative rounded-b-lg">
          <h1 className="text-2xl font-semibold tracking-tight text-white text-center py-1 border-y border-green-600">
            {rolesText}
          </h1>
          <ArtistLinks artist={artist} />
        </div>
      </div>
    </div>
  );
};

export default ArtistDetails;
