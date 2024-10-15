import React from 'react';
import Title from '@/components/atoms/Title/Title';
import { useTranslation } from 'react-i18next';
import { Artist } from '@/types/interfaces/Artist';



interface ArtistBioProps {
  artist: Artist;
}

const ArtistBio: React.FC<ArtistBioProps> = ({ artist }) => {
  const { t } = useTranslation();  
  return (
    <>
      <Title>{t('biography')}</Title>
      <p className="text-white">
        {artist && artist.bio ? artist.bio : t('availability.no_info')}
      </p>
    </>
  );
};

export default ArtistBio;
