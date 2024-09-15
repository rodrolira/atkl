import React from 'react'
import ArtistName from './ArtistName'
import ArtistImage from './ArtistImage'
import ArtistLinks from './ArtistLinks'

const ArtistDetails = ({ artist, adminAuthenticated, openEditModal }) => {
    // Concatenar roles con '/'
    const rolesText = artist.Roles && artist.Roles.length > 0
        ? artist.Roles.map(role => role.label).join(' / ')
        : 'No roles assigned'

    return (
        <div className='sm:w-1/3 sm:p-4 sm:border-r text-center text-white'>
            <ArtistImage 
                image={`http://localhost:3000/${artist.image}`} 
                alt={artist.artist_name} 
                adminAuthenticated={adminAuthenticated} 
                openEditModal={openEditModal} 
            />
            <div className='px-4'>
                <div className='bg-black  w-full h-auto relative rounded-b-lg'>
                    <h1 className='text-2xl font-semibold tracking-tight text-white text-center pt-4'>
                        {rolesText}
                    </h1>
                    <ArtistLinks artist={artist} />
                </div>
            </div>
        </div>
    )
}

export default ArtistDetails
