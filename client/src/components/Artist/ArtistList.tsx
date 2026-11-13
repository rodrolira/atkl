import React, { useMemo } from 'react';
import ArtistCard from './ArtistCard';
import { Artist } from '@/types/interfaces/Artist';
import Loading from '@/components/atoms/Loading/Loading';

interface ArtistListProps {
  artists: Artist[];
  loading?: boolean;
  error?: string | null;
}

const ArtistList: React.FC<ArtistListProps> = React.memo(({ artists, loading, error }) => {
  const memoizedArtists = useMemo(() => artists || [], [artists]);

  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4"><Loading /></div>;
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <div className="col-span-full text-red-400 text-center p-4">{error}</div>
      </div>
    );
  }

  if (memoizedArtists.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <div className="col-span-full text-metallic-gray text-center p-4">No hay artistas disponibles</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-50">
      {memoizedArtists.map((artist, index) => (
        <ArtistCard key={artist.id ?? `artist-${index}`} artist={artist} />
      ))}
    </div>
  );
});

export default ArtistList;
