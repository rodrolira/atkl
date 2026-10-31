// components/Release/ReleasesSection.tsx
import React, { useEffect } from 'react';
import { useReleases } from '@/contexts/ReleaseContext';
import ReleaseList from '@/components/Release/ReleaseList';
import Title from '@/components/atoms/Title/Title';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Background from '../Layout/Background';

const ReleasesSection: React.FC = () => {
  const { fetchReleases } = useReleases();
  const { t } = useTranslation();

  useEffect(() => {
    fetchReleases(); // Esto asegura que se carguen los lanzamientos
  }, [fetchReleases]);

  return (
    <section className="grid grid-cols-1 gap-4 p-4 sm:p-16 relative z-50" id="releases">
      <Link to="/releases" className="mx-auto">
        <Title>{t('releaseSection.title')}</Title>
      </Link>
      <ReleaseList />
      <Background />
    </section>
  );
};

export default ReleasesSection;
