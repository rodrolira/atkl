// ArtistReleases.jsx
import React, { useState, useEffect } from 'react'
import { useLanguage} from '@/hooks/useLanguage'
import { getArtistReleases } from '@/app/api/artists' // Importa la función para obtener los lanzamientos del artista

import Title from '@/components/atoms/Title/Title'
import ReleaseCard from '@/components/Release/ReleaseCard'

const ArtistReleases = ({ artist }) => {
    const { language } = useLanguage()
    const [releases, setReleases] = useState([])

    useEffect(() => {
        if (artist) { // Verifica si artist está definido
            fetchArtistReleases()
        }
    }, [artist]) // Vuelve a cargar los lanzamientos cuando cambia el artista

    const fetchArtistReleases = async () => {
        try {
            const response = await getArtistReleases(artist.id) // Obtén los lanzamientos del artista por su ID
            console.log('Artist releases:', response.data) // Verifica la estructura de datos aquí

            setReleases(response.data)
        } catch (error) {
            console.error('Error fetching artist releases:', error)
        }
    }

    return (
        <div>
            <Title > Releases </Title>
            <div className=' p-4 text-white text-center'>
                {releases && releases.length > 0
                    ? (
                        releases.map((release) => (
                            <div key={release.id} className='mb-4'>
                                <ReleaseCard
                                    release={release} // Pasa el objeto release completo
                                />
                            </div>
                        ))
                    )
                    : (
                        <p>{language === 'en' ? 'No releases available' : 'No hay releases disponibles'}</p>
                    )}

            </div>
        </div>

    )
}

export default ArtistReleases
