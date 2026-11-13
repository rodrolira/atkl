// controllers/artists.controller.js
import {
  addArtist as addArtistService,
  updateArtist as updateArtistService,
  deleteArtist as deleteArtistService,
  getArtists as getArtistsService,
  getArtistById as getArtistByIdService,
  getArtistReleases as getArtistReleasesService,
} from '../services/artistService.js'

export const addArtist = async (req, res) => {
  try {
    const artist = await addArtistService(req.body)
    res.status(201).json(artist)
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message })
  }
}

export const updateArtist = async (req, res) => {
  try {
    const artist = await updateArtistService(req.params.id, req.body)
    res.status(200).json(artist)
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message })
  }
}

export const deleteArtist = async (req, res) => {
  try {
    await deleteArtistService(req.params.id)
    res.status(200).json({ message: 'Artist and user account deleted successfully' })
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message })
  }
}

export const getArtists = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1)
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100)
    const result = await getArtistsService(page, limit)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getArtistById = async (req, res) => {
  try {
    const artist = await getArtistByIdService(req.params.id)
    res.status(200).json(artist)
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message })
  }
}

export const getArtistReleases = async (req, res) => {
  try {
    const releases = await getArtistReleasesService(req.params.id)
    res.status(200).json(releases)
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message })
  }
}
