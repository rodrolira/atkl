import React, { useEffect } from 'react';
import { useArtists } from '@/contexts/ArtistContext';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AddArtistForm from '@/components/Artist/AddArtist/AddArtistForm';
import ArtistList from '@/components/Artist/ArtistList';
import Title from '@/components/atoms/Title/Title';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';


// Define las propiedades que recibirá ArtistsSection
interface ArtistsSectionProps {}


const ArtistsSection: React.FC<ArtistsSectionProps> = () => {
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();
  const { artists, fetchArtists, createArtist } = useArtists();
  const { t } = useTranslation();

  // Asegúrate de que los artistas se establezcan a partir de artistsData
  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  const handleArtistAdded = async (newArtist: any) => {
    await createArtist(newArtist);
    fetchArtists(); // Esto podría no ser necesario si ya estás manejando artistsData
  };

  return (
    <section className="grid grid-cols-1 gap-4 p-4 sm:p-16" id="artists">
      <div className="mb-4 mx-auto">
        <Link to="/artists" className="mx-auto">
          <Title>{t('artistSection.title')}</Title>
        </Link>
        {adminAuthenticated && (
          <AddArtistForm onArtistAdded={handleArtistAdded} openPopup={false} closePopup={() => { }} />
        )}
      </div>
      <ArtistList artists={artists || []} />
    </section>
  );
};

export default ArtistsSection;
