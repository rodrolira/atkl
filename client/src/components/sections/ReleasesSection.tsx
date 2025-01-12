// components/Release/ReleasesSection.tsx
import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useReleases } from '@/contexts/ReleaseContext';
import AddReleaseForm from '@/components/Release/AddRelease/AddReleaseForm';
import ReleaseList from '@/components/Release/ReleaseList';
import Title from '@/components/atoms/Title/Title';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Background from '../Layout/Background';

const ReleasesSection: React.FC = () => {
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();
  const { releases, fetchReleases, createRelease } = useReleases();
  const { t } = useTranslation();
  
  const [isAddReleaseFormOpen, setIsAddReleaseFormOpen] = useState(false);

  useEffect(() => {
    fetchReleases(); // Esto asegura que se carguen los lanzamientos
  }, [fetchReleases]);

  const handleReleaseAdded = async (newRelease: any) => {
    await createRelease(newRelease);
    fetchReleases(); // Recargar los lanzamientos después de agregar uno nuevo
  };

  return (
    <section className="grid grid-cols-1 gap-4 p-4 sm:p-16 relative z-50" id="releases">
      <Link to="/releases" className="mx-auto">
        <Title>{t('releaseSection.title')}</Title>
      </Link>
      {adminAuthenticated && (
        <>
          <AddReleaseForm 
            onReleaseAdded={handleReleaseAdded} 
            open={isAddReleaseFormOpen} 
            closePopup={() => setIsAddReleaseFormOpen(false)} 
          />
        </>
      )}
      <ReleaseList releases={releases} />
      <Background />
    </section>
  );
};

export default ReleasesSection;
