import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ArtistCard from './ArtistCard';
import SwipeDeck from '@/components/Layout/SwipeDeck';
import { Artist } from '@/types/interfaces/Artist';
import Loading from '@/components/atoms/Loading/Loading';

interface ArtistListProps {
  artists: Artist[];
  loading?: boolean;
  error?: string | null;
}

const ArtistList: React.FC<ArtistListProps> = React.memo(({ artists, loading, error }) => {
  const { t } = useTranslation();
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

  // Dos por pantalla en móvil: la tarjeta de artista es foto + nombre + roles,
  // que entra bien en media columna. El catálogo va de a una porque lleva el
  // reproductor de Bandcamp.
  return (
    <div className="relative z-50">
      <SwipeDeck label={t('artistSection.title')} perView={2} total={memoizedArtists.length}>
        {memoizedArtists.map((artist, index) => (
          <ArtistCard key={artist.id ?? `artist-${index}`} artist={artist} />
        ))}
      </SwipeDeck>
    </div>
  );
});

export default ArtistList;
