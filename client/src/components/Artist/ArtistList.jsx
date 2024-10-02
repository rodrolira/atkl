import React from 'react';
import ArtistCard from './ArtistCard';

const ArtistList = ({ artists }) => {
  const artistList = Array.isArray(artists) ? artists : [];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {artistList.map((artist) => (
        <ArtistCard key={artist.id} artist={artist} />
      ))}
    </div>
  );
};

export default ArtistList;
