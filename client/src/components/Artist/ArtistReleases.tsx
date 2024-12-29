import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Title from '@/components/atoms/Title/Title';
import ReleaseCard from '@/components/Release/ReleaseCard';
import { Artist } from '@/types/interfaces/Artist';
import { Release } from '../../types/interfaces/Release';

interface ArtistReleasesProps {
  artist: Artist; // Define the artist prop type
}

const ArtistReleases: React.FC<ArtistReleasesProps> = ({ artist }) => {
  const { t } = useTranslation();
  const [releases, setReleases] = useState<Release[]>([]); // Define state type as array of Release

  useEffect(() => {
    if (artist) {
      fetchArtistReleases();
    }
  }, [artist]); // Reload releases when artist changes

  const fetchArtistReleases = () => {
    // Datos de ejemplo para los lanzamientos
    const localReleases = [
      { id: 1, title: 'Release 1', artist_id: artist.id, cover_image_url: '', genre_id: 1, release_type: 'Single', release_date: '2023-01-01' },
      { id: 2, title: 'Release 2', artist_id: artist.id, cover_image_url: '', genre_id: 2, release_type: 'EP', release_date: '2023-02-01' },
    ];

    setReleases(localReleases); // Establecer los lanzamientos locales en el estado
  };

  return (
    <div>
      <Title> Releases </Title>
      <div className="p-4 text-white text-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {releases.length > 0 ? (
          releases.map((release) => (
            <div key={release.id} className="mb-4 ">
              <ReleaseCard
                release={release} // Pass the entire release object
              />
            </div>
          ))
        ) : (
          <p className="col-span-full">
            {t('artistReleases.noReleases')}
          </p>
        )}
      </div>
    </div>
  );
};

export default ArtistReleases;
