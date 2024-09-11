import axios from './axios'

// Obtener todos los tracks
export const getTracksRequest = () => axios.get('/discography')

// Obtener un track por ID
export const getTrackRequest = (id) => axios.get(`/discography/${id}`)

// Crear un nuevo track
export const createTrackRequest = async (track) => {
    return await axios.post('/discography', track)
}

// Actualizar un track por ID
export const updateTrackRequest = async (id, track) => {
    return await axios.put(`/discography/${id}`, track)
}

// Eliminar un track por ID
export const deleteTrackRequest = async (id) => {
    return await axios.delete(`/discography/${id}`)
}

// Crear varios tracks desde un CSV
export const createTracksFromCSV = async (tracks) => {
    return await axios.post('/discography/bulk', tracks)
}
