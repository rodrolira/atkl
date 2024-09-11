// useArtistData.js
import { useState, useEffect } from 'react'
import { getArtistRequest } from '../api/artists'

export const useArtistData = (id) => {
    const [artist, setArtist] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchArtist = async () => {
            try {
                const response = await getArtistRequest(id)
                setArtist(response.data)
            } catch (err) {
                setError(err)
            }
        }
        fetchArtist()
    }, [id])

    return { artist, error }
}
