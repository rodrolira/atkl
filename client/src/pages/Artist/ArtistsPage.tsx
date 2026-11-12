import React from 'react';
import Navbar from '@/components/Navbar/Navbar';
import ArtistsSection from '@/components/sections/ArtistsSection';



const ArtistsPage: React.FC = React.memo(() => {
  return (
    <div>
      <Navbar />
      <main>
        <ArtistsSection />
      </main>
    </div>
  );
});

export default ArtistsPage;
