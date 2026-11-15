import React, { memo } from 'react';
import ReleaseCard from './ReleaseCard';
import SwipeDeck from '@/components/Layout/SwipeDeck';
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

  // De a una por pantalla en móvil, con la siguiente asomando. No van dos como
  // en artistas porque la tarjeta lleva el embed de Bandcamp en `size=large`
  // con lista de tracks: a media columna el reproductor queda inusable.
  return (
    <div className="relative z-50">
      <SwipeDeck label={t('releaseSection.title')} perView={1} total={releases.length}>
        {releases.map((release) => (
          <ReleaseCard key={release.id} release={release} />
        ))}
      </SwipeDeck>
    </div>
  );
};

export default memo(ReleaseList);
