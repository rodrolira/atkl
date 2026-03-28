import React from 'react';
import { useTranslation } from 'react-i18next';
import Title from '@/components/atoms/Title/Title';
import ReleaseCard from '@/components/Release/ReleaseCard';
import { Artist } from '@/types/interfaces/Artist';
import { Release } from '@/types/interfaces/Release';

interface ArtistReleasesProps {
  artist: Artist; // El artista al que se quieren enlazar los lanzamientos
  releases: Release[]; // Todos los lanzamientos disponibles
}

const ArtistReleases: React.FC<ArtistReleasesProps> = ({ artist, releases }) => {
  const { t } = useTranslation();

  const normalizedArtistName = artist.artist_name.trim().toLowerCase();
  const artistReleases = releases.filter((release) =>
    release.artists?.some((relArtist: Artist) => {
      const matchesId = relArtist.id !== undefined && relArtist.id === artist.id;
      const matchesName = relArtist.artist_name?.trim().toLowerCase() === normalizedArtistName;

      return matchesId || matchesName;
    }) ?? false
  );

  return (
    <div>
      <Title>Relases</Title>
      <div className="p-4 text-white text-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {artistReleases.length > 0 ? (
          artistReleases.map((release) => (
            <div key={release.id} className="mb-4">
              <ReleaseCard release={release} />
            </div>
          ))
        ) : (
          <p className="col-span-full">{t('artistReleases.noReleases')}</p>
        )}
      </div>
    </div>
  );
};

export default ArtistReleases;
