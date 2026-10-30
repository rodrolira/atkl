import React, { useMemo, memo } from 'react';
import ReleaseCard from './ReleaseCard';
import { useReleases } from '@/contexts/ReleaseContext';
import { useTranslation } from 'react-i18next';

const ReleaseList: React.FC = () => {
  const { releases, loading } = useReleases();
  const { t } = useTranslation();

  const memoizedReleaseCards = useMemo(
    () =>
      releases.map((release) => (
        <ReleaseCard key={release.id} release={release} />
      )),
    [releases]
  );

  if (loading && releases.length === 0) {
    return <p>{t('loading')}</p>;
  }

  if (releases.length === 0) {
    return <p>{t('availability.no_releases')}</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-50">
      {memoizedReleaseCards}
    </div>
  );
};

export default memo(ReleaseList);
