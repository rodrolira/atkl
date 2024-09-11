// ArtistsSection.jsx
// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import Title from '@/components/atoms/Title/Title';
import AddArtistForm from './AddArtistForm';
import ArtistList from './ArtistList';
import { useArtists } from '@/contexts/ArtistContext';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

function ArtistsSection() {
  const { language } = useLanguage(); // Obtiene el estado del idioma desde el contexto
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();
  const { artists, fetchArtists, createArtist } = useArtists();

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  const handleArtistAdded = async (newArtist) => {
    await createArtist(newArtist);
    fetchArtists();
  };

  return (
    <div className="grid grid-cols-1 gap-4 p-16" id="artists">
      <div className="mb-4 mx-auto">
        <a href="/artists" className="mx-auto">
          <Title>{language === 'en' ? 'Artists' : 'Artistas'}</Title>
        </a>
        {adminAuthenticated && (
          <AddArtistForm onArtistAdded={handleArtistAdded} />
        )}
      </div>
      <ArtistList artists={artists} />
    </div>
  );
}

export default ArtistsSection;
