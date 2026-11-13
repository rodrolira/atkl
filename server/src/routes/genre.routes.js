// routes/genre.routes.js
import express from 'express'
import GenreController from '../controllers/genre.controller.js'
import { verifyTokenAdmin } from '../middlewares/verifyTokenAdmin.js'

const router = express.Router()

// Ruta para obtener todos los géneros
router.get('/genres', GenreController.getAllGenres)

// Ruta para obtener un género por ID
router.get('/genres/:id', GenreController.getGenreById)

// Ruta para crear un nuevo género
router.post('/genres', verifyTokenAdmin, GenreController.createGenre)

// Ruta para actualizar un género existente
router.put('/genres/:id', verifyTokenAdmin, GenreController.updateGenre)

// Ruta para eliminar un género
router.delete('/genres/:id', verifyTokenAdmin, GenreController.deleteGenre)

export default router
