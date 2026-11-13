// controllers/genre.controller.js
import {
  getAllGenres as getAllGenresService,
  getGenreById as getGenreByIdService,
  createGenre as createGenreService,
  updateGenre as updateGenreService,
  deleteGenre as deleteGenreService,
} from '../services/genreService.js'

export const getAllGenres = async (req, res) => {
  try {
    const genres = await getAllGenresService()
    res.status(200).json(genres)
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch genres' })
  }
}

export const getGenreById = async (req, res) => {
  try {
    const genre = await getGenreByIdService(req.params.id)
    res.json(genre)
  } catch (error) {
    res.status(error.status || 500).json({ error: 'Unable to fetch genre' })
  }
}

export const createGenre = async (req, res) => {
  try {
    const newGenre = await createGenreService(req.body)
    res.status(201).json(newGenre)
  } catch (error) {
    res.status(error.status || 500).json({ error: 'Unable to create genre' })
  }
}

export const updateGenre = async (req, res) => {
  try {
    const updatedGenre = await updateGenreService(req.params.id, req.body)
    res.json(updatedGenre)
  } catch (error) {
    res.status(error.status || 500).json({ error: 'Unable to update genre' })
  }
}

export const deleteGenre = async (req, res) => {
  try {
    await deleteGenreService(req.params.id)
    res.json({ message: 'Genre deleted successfully' })
  } catch (error) {
    res.status(error.status || 500).json({ error: 'Unable to delete genre' })
  }
}

export default {
  getAllGenres,
  getGenreById,
  createGenre,
  updateGenre,
  deleteGenre,
}
