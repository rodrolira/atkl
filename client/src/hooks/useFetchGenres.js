// useFetchGenres.js
import { useState, useEffect } from 'react'
import { useGenres } from '../contexts/GenreContext'

const useFetchGenres = () => {
    const { fetchGenres } = useGenres()
    const [genres, setGenres] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadGenres = async () => {
            try {
                const data = await fetchGenres()
                setGenres(data)
            } catch (error) {
                setError(error)
            } finally {
                setLoading(false)
            }
        }

        loadGenres()
    }, [fetchGenres])
    return { genres, loading, error }
}

export default useFetchGenres
