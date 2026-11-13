// server/controllers/releases.controller.js
import {
  addRelease as addReleaseService,
  getReleases as getReleasesService,
  getReleaseById as getReleaseByIdService,
  updateRelease as updateReleaseService,
  deleteRelease as deleteReleaseService,
} from '../services/releaseService.js'

export const addRelease = async (req, res) => {
  try {
    const release = await addReleaseService(req.body, req.file ? req.file.path : null)
    res.status(201).json(release)
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message })
  }
}

export const getReleases = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1)
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100)
    const result = await getReleasesService(page, limit)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getReleaseById = async (req, res) => {
  try {
    const release = await getReleaseByIdService(req.params.id)
    res.status(200).json(release)
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message })
  }
}

export const updateRelease = async (req, res) => {
  try {
    const release = await updateReleaseService(
      req.params.id,
      req.body,
      req.file ? req.file.path : null
    )
    res.status(200).json(release)
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message })
  }
}

export const deleteRelease = async (req, res) => {
  try {
    await deleteReleaseService(req.params.id)
    res.status(200).json({ message: 'Release deleted successfully' })
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message })
  }
}
