// ReleasesPage.tsx

import React, { Suspense } from 'react'; // Importa React y Suspense
import Button from '@/components/Button/Button';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import Navbar from '@/components/Navbar/Navbar';
import { useTranslation } from 'react-i18next';

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
      <div className="sm:m-0 inline-block sm:mx-auto my-12 lg:my-16 sm:my-10 w-full">
        <div className="flex items-center justify-between">
          <a href="/releases" className="mx-auto"></a>
          {isAdmin && (
            <Button className="btn-add">
              {t('add_release')}
            </Button>
          )}
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <ReleaseSection /> {/* Renderiza el componente ReleaseSection */}
        </Suspense>
      </div>
    </div>
  );
}

export default ReleasesPage;
