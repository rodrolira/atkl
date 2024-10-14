import React from 'react';
import ArtistCard from './ArtistCard';

const ArtistList = ({ artists }) => {
  if (!Array.isArray(artists)) {
    return <div>No artists found.</div>; 
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {artists.map((artist, index) => (
        <ArtistCard key={artist.id || index} artist={artist} />
      ))}
    </div>
  );
};

export default ArtistList;
