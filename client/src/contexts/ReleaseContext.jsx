/* eslint-disable no-unused-vars */
import { createContext, useContext, useState, useCallback } from 'react'
import {
    getReleasesRequest,
    getReleaseRequest,
    createReleaseRequest,
    updateReleaseRequest,
    deleteReleaseRequest,
} from '@/app/api/releases'

export const ReleaseContext = createContext()

export const useReleases = () => {
    const context = useContext(ReleaseContext)

    if (!context) {
        console.log('useReleases must be used within a ReleaseProvider')
        throw new Error('useReleases must be used within a ReleaseProvider')
    }

    return context
}

export function ReleaseProvider({ children }) {
    const [releases, setReleases] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    // Lógica para obtener la lista de releases
    const fetchReleases = useCallback(async () => {
        setLoading(true)
        try {
            const response = await getReleasesRequest()
            setReleases(response.data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching releases:', error)
            setError('Failed to fetch releases')
            setLoading(false)
        }
    }, [])

    // Lógica para obtener un release por ID
    const fetchRelease = async id => {
        try {
            const response = await getReleaseRequest(id)
            return response.data
        } catch (error) {
            console.error(`Error fetching release with ID ${id}:`, error)
            throw error
        }
    }

    // Lógica para crear un release
    const createRelease = async release => {
        try {
            const res = await createReleaseRequest(release)
            setReleases(prevReleases => [...prevReleases, res.data])
            return res.data // Asegúrate de que esta línea exista
        } catch (error) {
            console.error('Error creating release:', error)
        }
    }
    // Lógica para actualizar un release
    const updateRelease = async (id, updatedRelease) => {
        try {
            const response = await updateReleaseRequest(id, updatedRelease)
            setReleases(prevReleases =>
                prevReleases.map(release =>
                    release.id === id ? response : release
                )
            )
            return response
        } catch (error) {
            console.error('Error updating release:', error)
            throw error
        }
    }

    // Lógica para eliminar un release
    const deleteRelease = async id => {
        try {
            await deleteReleaseRequest(id)
            setReleases(prevReleases =>
                prevReleases.filter(release => release.id !== id)
            )
        } catch (error) {
            console.error('Error deleting release:', error)
            throw error
        }
    }

    return (
        <ReleaseContext.Provider
            value={{
                releases,
                setReleases,
                fetchReleases,
                createRelease,
                updateRelease,
                deleteRelease,
                fetchRelease,
            }}
        >
            {children}
        </ReleaseContext.Provider>
    )
}
