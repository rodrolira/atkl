import React, { useState, useEffect } from 'react';
import { getArtistReleases } from '@/app/api/artists'; // Import the function to get artist releases
import { useTranslation } from 'react-i18next';
import Title from '@/components/atoms/Title/Title';
import ReleaseCard from '@/components/Release/ReleaseCard';
import { Artist } from '@/types/interfaces/Artist';

interface Release {
  id: number; // Add other properties of release if necessary
  // Add other properties that are relevant for the release
}



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

  const fetchArtistReleases = async () => {
    try {
      const response = await getArtistReleases(artist.id); // Get artist releases by ID
      console.log('Artist releases:', response.data); // Check data structure here

      setReleases(response.data);
    } catch (error) {
      console.error('Error fetching artist releases:', error);
    }
  };

  return (
    <div>
      <Title> Releases </Title>
      <div className="p-4 text-white text-center">
        {releases.length > 0 ? (
          releases.map((release) => (
            <div key={release.id} className="mb-4">
              <ReleaseCard
                release={release} // Pass the entire release object
              />
            </div>
          ))
        ) : (
          <p>
            {t('artistReleases.noReleases')}
          </p>
        )}
      </div>
    </div>
  );
};

export default ArtistReleases;
