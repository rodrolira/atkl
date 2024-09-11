import React from 'react'
import ReleaseCard from './ReleaseCard' // Asegúrate de tener un componente ReleaseCard

const ReleaseList = ({ releases }) => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {releases.map(release => (
                <ReleaseCard key={release.id} release={release} />
            ))}
        </div>
    )
}

export default ReleaseList
