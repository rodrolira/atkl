// ReleasesPage.tsx

import React, { Suspense } from 'react'; // Importa React y Suspense
import Navbar from '@/components/Navbar/Navbar';
import Loading from '@/components/atoms/Loading/Loading';

// Importa ReleaseSection usando importación dinámica
const ReleaseSection = React.lazy(
  () => import('@/components/sections/ReleasesSection'),
);

const ReleasesPage: React.FC = React.memo(() => {
  return (
    <div>
      <Navbar />
      <Suspense fallback={<Loading />}>
        <ReleaseSection /> {/* Renderiza el componente ReleaseSection */}
      </Suspense>
    </div>
  );
});

export default ReleasesPage;
