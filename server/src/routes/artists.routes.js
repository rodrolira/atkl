// routes/artists.routes.js
import express from 'express'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../../config/cloudinary.js'
import {
  getArtists,
  addArtist,
  deleteArtist,
  updateArtist,
  getArtistById,
  getArtistReleases,
} from '../controllers/artists.controller.js'
import { verifyTokenAdmin } from '../middlewares/verifyTokenAdmin.js'

const router = express.Router()

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'artists',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    public_id: (req, file) => `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`,
  },
})

const upload = multer({ storage })

router.get('/artists', getArtists)
router.get('/artists/:id', getArtistById)
router.get('/artists/:id/releases', getArtistReleases)

router.post('/artists', verifyTokenAdmin, upload.single('image'), async (req, res) => {
  try {
    const artist = await addArtist({
      ...req.body,
      image: req.file ? req.file.path : undefined,
    })
    res.status(201).json(artist)
  } catch (error) {
    console.error('Error adding artist:', error)
    res.status(error.status || 500).json({ message: error.message })
  }
})

router.put('/artists/:id', verifyTokenAdmin, upload.single('image'), async (req, res) => {
  try {
    const artist = await updateArtist(req.params.id, {
      ...req.body,
      image: req.file ? req.file.path : undefined,
    })
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' })
    }
    res.status(200).json(artist)
  } catch (error) {
    console.error('Error updating artist:', error)
    res.status(error.status || 500).json({ message: error.message })
  }
})

router.delete('/artists/:id', verifyTokenAdmin, deleteArtist)

export default router
