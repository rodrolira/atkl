import axios from './axios'

export const getReleasesRequest = () => axios.get('/releases')
export const getReleaseRequest = (id) => axios.get(`/releases/${id}`)

export const createReleaseRequest = async (release) => {
    return await axios.post('/releases', release)
}

export const updateReleaseRequest = async (id, release) => {
    return await axios.put(`/releases/${id}`, release)
}

export const deleteReleaseRequest = async (id) => {
    return await axios.delete(`/releases/${id}`)
}
