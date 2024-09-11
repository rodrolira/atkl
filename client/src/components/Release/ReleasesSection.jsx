// ReleasesSection.jsx

// eslint-disable-next-line react/prop-types, no-unused-vars
import React, { useEffect } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useReleases } from '@/contexts/ReleaseContext';
import AddReleaseForm from './AddReleaseForm';
import ReleaseList from './ReleaseList';
import Title from '@/components/atoms/Title/Title';
import { useLanguage } from '@/hooks/useLanguage';

function ReleasesSection() {
  const { language } = useLanguage(); // Obtiene el estado del idioma desde el contexto
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();
  const { releases, fetchReleases, createRelease } = useReleases();

  useEffect(() => {
    fetchReleases();
  }, [fetchReleases]);

  const handleReleaseAdded = async (newRelease) => {
    await createRelease(newRelease); // Agrega el nuevo lanzamiento a la lista de lanzamientos
    fetchReleases();
  };

  return (
    <div className="grid grid-cols-1 gap-4  p-16" id="releases">
      <a href="/releases" className="mx-auto">
        <Title>{language === 'en' ? 'Releases' : 'Lanzamientos'}</Title>
      </a>
      {adminAuthenticated && (
        <AddReleaseForm onReleaseAdded={handleReleaseAdded} />
      )}
      <ReleaseList releases={releases} />
    </div>
  );
}

export default ReleasesSection;
