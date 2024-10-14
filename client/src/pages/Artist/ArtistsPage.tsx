import React from 'react';
import Navbar from '@/components/Navbar/Navbar';
import ArtistsSection from '@/components/sections/ArtistsSection';



const ArtistsPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="my-12 lg:my-16">
        <ArtistsSection />
      </div>
    </div>
  );
};

export default ArtistsPage;
