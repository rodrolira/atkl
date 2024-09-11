import React, { createContext, useContext, useCallback, useState } from 'react'
import { getGenresRequest } from '@/app/api/genres'

// Creamos el contexto de géneros musicales
const GenreContext = createContext()

// Hook personalizado para usar el contexto de géneros musicales
export const useGenres = () => {
    const context = useContext(GenreContext)

    if (!context) {
        console.log('useArtist must be used within an GenreProvider')
        throw new Error('useArtist must be used within an GenreProvider')
    }
    return context
}

// Proveedor del contexto de géneros musicales
export const GenreProvider = ({ children }) => {
    const [genres, setGenres] = useState([])

    // Función para obtener la lista de géneros desde la API
    const fetchGenres = useCallback(async () => {
        // Asegúrate de que este fetch esté funcionando correctamente y devuelva los datos esperados.
        const response = await getGenresRequest() // Ajusta la ruta según tu API
        setGenres(response.data) // Actualiza la lista de géneros con la respuesta de la API
        return response.data
    }, [])

    // Retorna el proveedor del contexto con los valores disponibles
    return (
        <GenreContext.Provider
            data-testid="genre-provider"
            value={{
                genres,
                fetchGenres

            }}>{children}
        </GenreContext.Provider>
    )
}
