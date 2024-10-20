import React from 'react';
import ReleaseCard from './ReleaseCard'; // Asegúrate de tener un componente ReleaseCard

const ReleaseList = ({ releases }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-50">
      {releases.map((release, index) => (
        <ReleaseCard key={release.id || index} release={release} />
      ))}
    </div>
  );
};

export default ReleaseList;
