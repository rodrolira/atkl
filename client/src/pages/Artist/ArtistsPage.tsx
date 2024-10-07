import React from 'react';
import Navbar from '@/components/Navbar/Navbar';
import ArtistsSection from '@/components/sections/ArtistsSection';

// Define el tipo para artistsData según la estructura que esperes
interface Artist {
  id: string;
  name: string;
  // Agrega otros campos que sean relevantes
}

interface ArtistsPageProps {
  artistsData: Artist[]; // O el tipo específico que necesites
}

const ArtistsPage: React.FC<ArtistsPageProps> = ({ artistsData }) => {
  return (
    <div>
      <Navbar />
      <div className="my-12 lg:my-16">
        <ArtistsSection artistsData={artistsData} />
      </div>
    </div>
  );
};

export default ArtistsPage;
