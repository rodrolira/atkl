import React, { memo } from 'react';
import ReleaseCard from './ReleaseCard';
import { useReleases } from '@/contexts/ReleaseContext';
import { useTranslation } from 'react-i18next';
import Loading from '@/components/atoms/Loading/Loading';

const ReleaseList: React.FC = () => {
  const { releases, loading, error } = useReleases();
  const { t } = useTranslation();

  if (error) {
    return (
      <div className="col-span-full text-red-400 text-center p-4">
        {error}
      </div>
    );
  }

  if (loading && releases.length === 0) {
    return <div className="col-span-full p-4"><Loading /></div>;
  }

  if (releases.length === 0) {
    return <p>{t('availability.no_releases')}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-50">
      {releases.map((release) => (
        <ReleaseCard key={release.id} release={release} />
      ))}
    </div>
  );
};

export default memo(ReleaseList);
