// ReleasesSection.tsx

// eslint-disable-next-line react/prop-types, no-unused-vars
import React, { useEffect, useCallback } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useReleases } from '@/contexts/ReleaseContext';
import AddReleaseForm from '@/components/Release/AddRelease/AddReleaseForm';
import ReleaseList from '@/components/Release/ReleaseList';
import Title from '@/components/atoms/Title/Title';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Background from '../Layout/Background';

interface ReleasesSectionProps { }

const ReleasesSection: React.FC<ReleasesSectionProps> = React.memo(() => {
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();
  const { releases, fetchReleases, createRelease } = useReleases();

  const { t } = useTranslation();

  useEffect(() => {
    fetchReleases();
  }, [fetchReleases]);

  const handleReleaseAdded = useCallback(async (newRelease: any) => {
    await createRelease(newRelease); // Agrega el nuevo lanzamiento a la lista de lanzamientos
    fetchReleases();
  }, [createRelease, fetchReleases]);

  return (
    <section className="grid grid-cols-1 gap-4 p-4 sm:p-16 relative z-50" id="releases">
      <Link to="/releases" className="mx-auto">
        <Title>{t('releaseSection.title')}</Title>
      </Link>
      {adminAuthenticated && (
        <AddReleaseForm onReleaseAdded={handleReleaseAdded} open={false} closePopup={() => { }} />
      )}
      <ReleaseList releases={releases} />
      <Background />
    </section>
  );
})

export default ReleasesSection;
