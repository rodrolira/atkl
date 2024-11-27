import React, { useEffect, useCallback, useMemo } from 'react';
import { useArtists } from '@/contexts/ArtistContext';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AddArtistForm from '@/components/Artist/AddArtistForm';
import ArtistList from '@/components/Artist/ArtistList';
import Title from '@/components/atoms/Title/Title';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Background from '../Layout/Background';



// Define las propiedades que recibirá ArtistsSection
interface ArtistsSectionProps {}


const ArtistsSection: React.FC<ArtistsSectionProps> = React.memo(() => {
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();
  const { artists, fetchArtists, createArtist } = useArtists();
  const { t } = useTranslation();

  // Asegúrate de que los artistas se establezcan a partir de artistsData
  useEffect(() => {
    if (memoizedArtists.length === 0) {
      fetchArtists();
    }
  }, [fetchArtists]);

  const handleArtistAdded = useCallback(async (newArtist: any) => {
    await createArtist(newArtist);
  }, [createArtist]);

  const closePopup = () => { };

  const memoizedArtists = useMemo(() => artists || [], [artists]);

  return (
    <section className="grid grid-cols-1 gap-4 p-4 sm:p-16 relative z-50" id="artists">
      <div className="mb-4 mx-auto z-50">
        <Link to="/artists" className="mx-auto">
          <Title>{t('artistSection.title')}</Title>
        </Link>
        {adminAuthenticated && (
          <AddArtistForm onArtistAdded={handleArtistAdded} openPopup={false} closePopup={closePopup} />
        )}
      </div>
      <ArtistList artists={memoizedArtists} />
      <Background />
    </section>
  );
});

export default ArtistsSection;
