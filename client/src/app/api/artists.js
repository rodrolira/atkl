import axios from './axios'

export const getArtistsRequest = () => axios.get('/artists')
export const getArtistRequest = (id) => axios.get(`/artists/${id}`)

export const getArtistReleases = (id) => {
    return axios.get(`/artists/${id}/releases`)
}

export const createArtistRequest = async (artist) => {
    return await axios.post('/artists', artist)
}

export const updateArtistRequest = async (id, artist) => {
    return await axios.put(`/artists/${id}`, artist)
}

export const deleteArtistRequest = async (id) => {
    return await axios.delete(`/artists/${id}`)
}

export const getRolesRequest = async () => {
    return await axios.get('/roles')
}
