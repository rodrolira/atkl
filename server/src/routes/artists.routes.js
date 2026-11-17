// routes/artists.routes.js
import express from 'express'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../../config/cloudinary.js'
import {
  getArtists,
  deleteArtist,
  getArtistById,
  getArtistReleases,
} from '../controllers/artists.controller.js'
// POST y PUT llaman al servicio, no al controlador: son los dos únicos que
// pasan por multer y necesitan meter `req.file.path` en los datos, cosa que el
// controlador no hace. Antes importaban `addArtist`/`updateArtist` del
// controlador y los llamaban con (datos) y (id, datos); como el controlador
// tiene firma (req, res), terminaba ejecutando `res.status(...)` sobre un
// objeto de datos y el PUT respondía 500 "res.status is not a function".
import {
  addArtist as addArtistService,
  updateArtist as updateArtistService,
} from '../services/artistService.js'
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
    const artist = await addArtistService({
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
    const artist = await updateArtistService(req.params.id, {
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
