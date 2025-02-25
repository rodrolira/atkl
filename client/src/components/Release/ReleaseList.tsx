import React, { useMemo, memo, useEffect, useState } from 'react';
import ReleaseCard from './ReleaseCard'; 
import { Release } from '@/types/interfaces/Release';
import { releaseData } from "@/data/releaseData";
import useFetchCloudinaryTracks from "@/hooks/useFetchCloudinaryTracks";

const ReleaseList: React.FC = () => {
  const { tracks, loading, error } = useFetchCloudinaryTracks();
  const [updatedReleases, setUpdatedReleases] = useState<Release[]>(releaseData);

  useEffect(() => {
    if (!loading && tracks.length > 0) {
      setUpdatedReleases((prevReleases) =>
        prevReleases.map((release) =>
          release.title === "Unknown VA I"
            ? { ...release, tracks: [...(release.tracks || []), ...tracks] } // 🔹 Concatenar en caso de que ya tenga tracks
            : release
        )
      );
    }
  }, [tracks, loading]);

  const memoizedReleaseCards = useMemo(
    () =>
      updatedReleases.map((release, index) => (
        <ReleaseCard key={release.id || index} release={release} />
      )),
    [updatedReleases] // 🔹 Ahora depende de updatedReleases
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-50">
      {loading ? <p>Cargando tracks...</p> : memoizedReleaseCards}
    </div>
  );
};

export default memo(ReleaseList);
