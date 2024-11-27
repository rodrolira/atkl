// components/ReleaseList.tsx
import React, { useMemo } from 'react';
import ReleaseCard from './ReleaseCard'; // Asegúrate de tener un componente ReleaseCard correctamente tipado
import { Release } from '@/types/interfaces/Release';


// Define las props para el componente ReleaseList
interface ReleaseListProps {
  releases: Release[];
}

const ReleaseList: React.FC<ReleaseListProps> = ({ releases }) => {
  const memoizedReleaseCards = useMemo(
    () =>
      releases.map((release, index) => (
        <ReleaseCard key={release.id || index} release={release} />
      )),
    [releases]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-50">
      {memoizedReleaseCards}
    </div>
  );
};

export default ReleaseList;
