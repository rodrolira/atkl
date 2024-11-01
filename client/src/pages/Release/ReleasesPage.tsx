// ReleasesPage.tsx

import React, { Suspense } from 'react'; // Importa React y Suspense
import Button from '@/components/Button/Button';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import Navbar from '@/components/Navbar/Navbar';
import { useTranslation } from 'react-i18next';
import Loading from '@/components/atoms/Loading/Loading';

// Importa ReleaseSection usando importación dinámica
const ReleaseSection = React.lazy(
  () => import('@/components/sections/ReleasesSection'),
);

const ReleasesPage: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated: isAdmin } = useAdminAuth();

  return (
    <div>
      <Navbar />
      <Suspense fallback={<Loading />}>
        <ReleaseSection /> {/* Renderiza el componente ReleaseSection */}
      </Suspense>
    </div>
  );
}

export default ReleasesPage;
