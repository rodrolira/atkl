import axios from './axios'

export const getGenresRequest = () => axios.get('/genres')
