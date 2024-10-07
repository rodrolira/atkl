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

const ArtistsSection: React.FC = () => {
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();
  const { artists, fetchArtists, createArtist } = useArtists();
  const { t } = useTranslation();

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  const handleArtistAdded = async (newArtist: Artist) => {
    await createArtist(newArtist);
    fetchArtists();
  };

  return (
    <section className="grid grid-cols-1 gap-4 p-4 sm:p-16" id="artists">
      <div className="mb-4 mx-auto">
        <Link to="/artists" className="mx-auto">
          <Title>{t('artistSection.title')}</Title>
        </Link>
        {adminAuthenticated && (
          <AddArtistForm onArtistAdded={handleArtistAdded} />
        )}
      </div>
      <ArtistList artists={artists} />
    </section>
  );
};

export default ArtistsSection;
