// routes/discography.routes.js
import { Router } from 'express'
import Discography from '../models/discography.model.js'
import { verifyTokenAdmin } from '../middlewares/verifyTokenAdmin.js'
import { validarIdNumerico } from '../middlewares/validarIdNumerico.js'

const router = Router()

// Columnas que el cliente puede setear. `id` y los timestamps los pone la base:
// aceptarlos del body permitia fijar el id (visto: POST con id:7777 creaba la
// fila con ese id) o falsear createdAt. Todo lo que no este en esta lista se
// descarta antes de llegar a Sequelize.
const CAMPOS_TRACK = [
    'title',
    'artist',
    'release_title',
    'catalogue',
    'release_type',
    'release_date',
    'genre',
    'file_info',
    'download_url',
]

const soloCamposPermitidos = (track) => {
    const limpio = {}
    for (const campo of CAMPOS_TRACK) {
        if (track?.[campo] !== undefined) limpio[campo] = track[campo]
    }
    return limpio
}

// Tope del lote: el /bulk corria un Discography.create por registro sin limite,
// asi que un POST con miles de filas (visto: 5000 = ~2.8s) ataba el proceso. Un
// import de CSV real no pasa de unos cientos.
const MAX_BULK = 500

// Crear varios tracks a partir de datos CSV
router.post('/discography/bulk', verifyTokenAdmin, async (req, res) => {
    try {
        const tracks = req.body
        if (!Array.isArray(tracks)) {
            return res.status(400).json({ error: 'Los datos deben ser una lista de registros.' })
        }
        if (tracks.length === 0 || tracks.length > MAX_BULK) {
            return res.status(400).json({ error: `El lote debe tener entre 1 y ${MAX_BULK} registros.` })
        }

        const cleanedTracks = tracks.map(soloCamposPermitidos)
        const results = await Discography.bulkCreate(cleanedTracks)
        res.status(201).json(results)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// Crear un nuevo track
router.post('/discography', verifyTokenAdmin, async (req, res) => {
    try {
        const track = await Discography.create(soloCamposPermitidos(req.body))
        res.status(201).json(track)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

// Obtener todos los tracks
router.get('/discography', async (req, res) => {
    try {
        const tracks = await Discography.findAll()
        res.status(200).json(tracks)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Obtener un track por ID
router.get('/discography/:id', validarIdNumerico(), async (req, res) => {
    try {
        const track = await Discography.findByPk(req.params.id)
        if (!track) {
            return res.status(404).json({ error: 'Track not found' })
        }
        res.status(200).json(track)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Actualizar un track por ID
router.put('/discography/:id', verifyTokenAdmin, validarIdNumerico(), async (req, res) => {
    try {
        const [updated] = await Discography.update(soloCamposPermitidos(req.body), {
            where: { id: req.params.id }
        })
        if (updated) {
            const updatedTrack = await Discography.findByPk(req.params.id)
            res.status(200).json(updatedTrack)
        } else {
            res.status(404).json({ error: 'Track not found' })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Eliminar un track por ID
router.delete('/discography/:id', verifyTokenAdmin, validarIdNumerico(), async (req, res) => {
    try {
        const deleted = await Discography.destroy({
            where: { id: req.params.id }
        })
        if (deleted) {
            res.status(204).json({})
        } else {
            res.status(404).json({ error: 'Track not found' })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

export default router
