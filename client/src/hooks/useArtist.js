// hooks/useArtist
// This hook should be focused on a single artist's operations.

import { useState, useEffect } from 'react'
import {
    getArtistRequest,
    updateArtistRequest,
    deleteArtistRequest,
} from '@/app/api/artists'

export const useArtist = (id) => {
    const [artist, setArtist] = useState(null)
    const [error, setError] = useState(null)

    const fetchArtist = async (artistId) => {
        try {
            const response = await getArtistRequest(artistId)
            setArtist(response.data)
        } catch (error) {
            setError(error)
        }
    }

    // Lógica para actualizar un artista

    const updateArtist = async (artistId, updatedArtist) => {
        try {
            await updateArtistRequest(artistId, updatedArtist)
            fetchArtist(artistId)
        } catch (error) {
            setError(error)
        }
    }

    // Lógica para eliminar un artista
    const deleteArtist = async (artistId) => {
        try {
            await deleteArtistRequest(artistId)
            setArtist(null)
        } catch (error) {
            setError(error)
        }
    }

    useEffect(() => {
        if (id) {
            fetchArtist(id)
        } else {
            setArtist(null)
        }
    }, [id])

    return { artist, error, fetchArtist, updateArtist, deleteArtist }
}
