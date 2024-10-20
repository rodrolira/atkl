import React from 'react';
import ArtistCard from './ArtistCard';
import { Artist } from '@/types/interfaces/Artist';

interface ArtistListProps {
  artists: Artist[];
}

const ArtistList: React.FC<ArtistListProps> = ({ artists }) => {
  if (!Array.isArray(artists) || artists.length === 0) {
    return <div>No artists found.</div>; 
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-50">
      {artists.map((artist) => (
        <ArtistCard key={artist.id} artist={artist} />
      ))}
    </div>
  );
};

export default ArtistList;
