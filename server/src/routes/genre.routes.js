// routes/genre.routes.js
import express from 'express'
import GenreController from '../controllers/genre.controller.js'
import { verifyTokenAdmin } from '../middlewares/verifyTokenAdmin.js'
import { validarIdNumerico } from '../middlewares/validarIdNumerico.js'

const router = express.Router()

// Ruta para obtener todos los géneros
router.get('/genres', GenreController.getAllGenres)

// Ruta para obtener un género por ID
router.get('/genres/:id', validarIdNumerico(), GenreController.getGenreById)

// Ruta para crear un nuevo género
router.post('/genres', verifyTokenAdmin, GenreController.createGenre)

// Ruta para actualizar un género existente
router.put('/genres/:id', verifyTokenAdmin, validarIdNumerico(), GenreController.updateGenre)

// Ruta para eliminar un género
router.delete('/genres/:id', verifyTokenAdmin, validarIdNumerico(), GenreController.deleteGenre)

export default router
