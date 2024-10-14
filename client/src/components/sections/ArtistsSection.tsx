import React, { useEffect } from 'react';
import Title from '@/components/atoms/Title/Title';
import AddArtistForm from '@/components/Artist/AddArtist/AddArtistForm';
import ArtistList from '@/components/Artist/ArtistList';
import { useArtists } from '@/contexts/ArtistContext';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// Define the type for the new artist object
interface Artist {
  id: string;
  name: string;
  // Agrega otros campos según lo necesites
}

// Define las propiedades que recibirá ArtistsSection
interface ArtistsSectionProps {
  artistsData: Artist[]; // Recibe la lista de artistas
}


const ArtistsSection: React.FC<ArtistsSectionProps> = ({ artistsData = [] }) => {
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();
  const { fetchArtists, createArtist } = useArtists();
  const { t } = useTranslation();

  // Asegúrate de que los artistas se establezcan a partir de artistsData
  useEffect(() => {
    if (artistsData.length === 0) {
      fetchArtists();
    }
  }, [fetchArtists, artistsData]);

  const handleArtistAdded = async (newArtist: Artist) => {
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
          <AddArtistForm onArtistAdded={handleArtistAdded} openPopup={false} closePopup={() => {}} />
        )}
      </div>
      <ArtistList artists={artistsData} />
    </section>
  );
};

export default ArtistsSection;
