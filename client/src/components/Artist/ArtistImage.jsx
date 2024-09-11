import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'flowbite-react'
import React from 'react'

const ArtistImage = ({ image, alt, adminAuthenticated, openEditModal }) => (
    <div className='relative p-4 pb-0 rounded-lg'>
        {adminAuthenticated && (
            <Button
                color='transparent'
                type='button'
                onClick={openEditModal}
                aria-label='Edit Artist'
                className='absolute top-2 right-2 text-gray-400 hover:text-yellow-500 p-2'
            >
                <FontAwesomeIcon icon={faEdit} size='xl' />
            </Button>
        )}

        <img
            className='rounded-t-lg'
            src={image}
            alt={alt}
        />
    </div>
)

export default ArtistImage
