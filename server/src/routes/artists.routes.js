// routes/artists.routes.js
import express from 'express'
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
import { subirImagen } from '../middlewares/subidaImagen.js'
import { validarIdNumerico } from '../middlewares/validarIdNumerico.js'
import { mensajeSeguro } from '../utils/mensajeSeguro.js'
import {
  crearArtistaSchema,
  actualizarArtistaSchema,
  validarArtista,
} from '../../schemas/artist.schema.js'

const router = express.Router()

/**
 * Un error con `status` es una respuesta prevista (datos inválidos, no
 * encontrado): se devuelve tal cual y no ensucia los logs. Lo que no lo trae
 * es un bug y ahí sí queremos el stack completo en Render.
 */
const responderError = (res, error, contexto) => {
  const status = error.status ?? 500
  if (status >= 500) console.error(contexto, error)
  // mensajeSeguro generaliza los 5xx en producción para no filtrar el error
  // crudo de Sequelize/Postgres; los 4xx (con su `errores` por campo) pasan.
  res.status(status).json({ message: mensajeSeguro(error), errores: error.errores })
}

/**
 * Junta el cuerpo validado con la imagen.
 *
 * `image` sale siempre de lo que subió multer, nunca del cuerpo: si se
 * aceptara del cliente, cualquiera podría apuntar la foto de un artista a una
 * URL arbitraria.
 *
 * Si vino un archivo pero el storage no devolvió URL, la imagen se perdió. Se
 * corta acá: antes el alta respondía 201 como si se hubiera guardado y el
 * artista quedaba sin foto sin que nadie se enterara.
 */
const datosConImagen = (req, schema) => {
  if (req.file && !req.file.path) {
    const error = new Error('No se pudo guardar la imagen: el almacenamiento no devolvió una URL')
    error.status = 502
    throw error
  }

  const { image: _delCliente, ...cuerpo } = req.body
  return validarArtista(schema, { ...cuerpo, image: req.file?.path })
}

router.get('/artists', getArtists)
router.get('/artists/:id', validarIdNumerico(), getArtistById)
router.get('/artists/:id/releases', validarIdNumerico(), getArtistReleases)

router.post('/artists', verifyTokenAdmin, subirImagen('artists', 'image'), async (req, res) => {
  try {
    const artist = await addArtistService(datosConImagen(req, crearArtistaSchema))
    res.status(201).json(artist)
  } catch (error) {
    responderError(res, error, 'Error adding artist:')
  }
})

router.put('/artists/:id', verifyTokenAdmin, validarIdNumerico(), subirImagen('artists', 'image'), async (req, res) => {
  try {
    const artist = await updateArtistService(
      req.params.id,
      datosConImagen(req, actualizarArtistaSchema)
    )
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' })
    }
    res.status(200).json(artist)
  } catch (error) {
    responderError(res, error, 'Error updating artist:')
  }
})

router.delete('/artists/:id', verifyTokenAdmin, validarIdNumerico(), deleteArtist)

export default router
