import React, { useMemo } from 'react';
import ArtistCard from './ArtistCard';
import { Artist } from '@/types/interfaces/Artist';

interface ArtistListProps {
  artists: Artist[];
}

const ArtistList: React.FC<ArtistListProps> = React.memo(({ artists }) => {
  const memoizedArtists = useMemo(() => artists, [artists]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-50">
      {memoizedArtists.map((artist, index) => (
        <ArtistCard key={artist.id ?? `artist-${index}`} artist={artist} />
      ))}
    </div>
  );
});

export default ArtistList;
