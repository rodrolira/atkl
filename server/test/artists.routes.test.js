/**
 * Tests de las rutas POST y PUT /artists.
 *
 * Existen porque artists.test.js prueba el CONTROLADOR con (req, res)
 * mockeados, y el bug que rompió el guardado en producción estaba en el
 * cableado de la RUTA: importaba el controlador y lo llamaba con la firma del
 * servicio, así que respondía 500 "res.status is not a function". Ningún test
 * tocaba las rutas, por eso pasó desapercibido.
 *
 * Se mockea el servicio (no hay base), Cloudinary (no hay credenciales) y el
 * middleware de admin (no hay token). Multer corre de verdad: así se ejercita
 * el parseo real del multipart, que es donde viven los casos con imagen.
 */
import express from 'express'
import request from 'supertest'
import * as artistService from '../src/services/artistService.js'

jest.mock('../src/services/artistService.js', () => ({
  addArtist: jest.fn(),
  updateArtist: jest.fn(),
  deleteArtist: jest.fn(),
  getArtists: jest.fn(),
  getArtistById: jest.fn(),
  getArtistReleases: jest.fn(),
}))

jest.mock('../config/cloudinary.js', () => ({ __esModule: true, default: {} }))

jest.mock('../src/middlewares/verifyTokenAdmin.js', () => ({
  verifyTokenAdmin: (req, res, next) => next(),
}))

/** Storage falso: devuelve una URL como lo haría Cloudinary. */
const mockUrlSubida = 'https://fake.test/artists/foto.png'
let mockStorageFalla = false

jest.mock('multer-storage-cloudinary', () => ({
  CloudinaryStorage: class {
    _handleFile(req, file, cb) {
      file.stream.resume()
      // `path` ausente simula una subida que no devolvió URL.
      cb(null, mockStorageFalla ? { filename: 'foto' } : { path: mockUrlSubida, filename: 'foto' })
    }

    _removeFile(req, file, cb) {
      cb(null)
    }
  },
}))

// Import normal: jest.mock se hoistea por encima, así que el router ya recibe
// los dobles. El storage falso solo lee mockUrlSubida dentro de _handleFile,
// que corre en cada test y no al definir la clase.
import artistsRouter from '../src/routes/artists.routes.js'

const app = express()
app.use('/api', artistsRouter)

const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64'
)

beforeEach(() => {
  jest.clearAllMocks()
  mockStorageFalla = false
})

describe('POST /api/artists', () => {
  test('crea sin imagen y responde 201', async () => {
    artistService.addArtist.mockResolvedValue({ id: 7, artist_name: 'Nova' })

    const res = await request(app)
      .post('/api/artists')
      .field('artist_name', 'Nova')
      .field('email', 'nova@example.com')

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ id: 7, artist_name: 'Nova' })
    // Sin archivo no se manda `image`, para no pisar la que ya tenga.
    expect(artistService.addArtist).toHaveBeenCalledWith(
      expect.objectContaining({ artist_name: 'Nova', email: 'nova@example.com' })
    )
    expect(artistService.addArtist.mock.calls[0][0].image).toBeUndefined()
  })

  test('crea con imagen y guarda la URL que devolvió el storage', async () => {
    artistService.addArtist.mockResolvedValue({ id: 8, image: mockUrlSubida })

    const res = await request(app)
      .post('/api/artists')
      .field('artist_name', 'Nova')
      .field('email', 'nova@example.com')
      .attach('image', PNG, 'foto.png')

    expect(res.status).toBe(201)
    expect(artistService.addArtist).toHaveBeenCalledWith(
      expect.objectContaining({ image: mockUrlSubida })
    )
  })

  test('normaliza roleIds de "1,2" a números', async () => {
    artistService.addArtist.mockResolvedValue({ id: 9 })

    await request(app)
      .post('/api/artists')
      .field('artist_name', 'Nova')
      .field('email', 'nova@example.com')
      .field('roleIds', '1,2')

    expect(artistService.addArtist).toHaveBeenCalledWith(
      expect.objectContaining({ roleIds: [1, 2] })
    )
  })

  test('ignora una image mandada por el cliente', async () => {
    // Si se aceptara, cualquiera podría apuntar la foto a una URL ajena.
    artistService.addArtist.mockResolvedValue({ id: 10 })

    await request(app)
      .post('/api/artists')
      .field('artist_name', 'Nova')
      .field('email', 'nova@example.com')
      .field('image', 'https://sitio-ajeno.test/lo-que-sea.png')

    expect(artistService.addArtist.mock.calls[0][0].image).toBeUndefined()
  })

  test('responde 400 y no llama al servicio si el nombre viene vacío', async () => {
    const res = await request(app)
      .post('/api/artists')
      .field('artist_name', '')
      .field('email', 'nova@example.com')

    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/nombre/i)
    expect(artistService.addArtist).not.toHaveBeenCalled()
  })

  test('responde 400 si el email no es válido', async () => {
    const res = await request(app)
      .post('/api/artists')
      .field('artist_name', 'Nova')
      .field('email', 'no-es-un-mail')

    expect(res.status).toBe(400)
    expect(res.body.errores).toEqual([
      expect.objectContaining({ campo: 'email' }),
    ])
  })

  test('responde 502 si la subida no devolvió URL', async () => {
    // Antes esto daba 201 y el artista quedaba sin foto en silencio.
    mockStorageFalla = true

    const res = await request(app)
      .post('/api/artists')
      .field('artist_name', 'Nova')
      .field('email', 'nova@example.com')
      .attach('image', PNG, 'foto.png')

    expect(res.status).toBe(502)
    expect(res.body.message).toMatch(/imagen/i)
    expect(artistService.addArtist).not.toHaveBeenCalled()
  })

  test('propaga el status de un error del servicio', async () => {
    const error = new Error('Ya existe una cuenta con ese email')
    error.status = 409
    artistService.addArtist.mockRejectedValue(error)

    const res = await request(app)
      .post('/api/artists')
      .field('artist_name', 'Nova')
      .field('email', 'nova@example.com')

    expect(res.status).toBe(409)
    expect(res.body.message).toBe('Ya existe una cuenta con ese email')
  })
})

describe('PUT /api/artists/:id', () => {
  test('actualiza sin imagen y responde 200', async () => {
    artistService.updateArtist.mockResolvedValue({ id: 11, artist_name: 'Editado' })

    const res = await request(app).put('/api/artists/11').field('artist_name', 'Editado')

    expect(res.status).toBe(200)
    // El id va como primer argumento: invertirlo era el bug que daba 500.
    expect(artistService.updateArtist).toHaveBeenCalledWith(
      '11',
      expect.objectContaining({ artist_name: 'Editado' })
    )
  })

  test('actualiza cambiando la imagen', async () => {
    artistService.updateArtist.mockResolvedValue({ id: 11, image: mockUrlSubida })

    const res = await request(app)
      .put('/api/artists/11')
      .field('artist_name', 'Editado')
      .attach('image', PNG, 'foto.png')

    expect(res.status).toBe(200)
    expect(artistService.updateArtist).toHaveBeenCalledWith(
      '11',
      expect.objectContaining({ image: mockUrlSubida })
    )
  })

  test('acepta una edición parcial', async () => {
    artistService.updateArtist.mockResolvedValue({ id: 11 })

    const res = await request(app).put('/api/artists/11').field('bio', 'Nueva bio')

    expect(res.status).toBe(200)
    expect(artistService.updateArtist).toHaveBeenCalledWith('11', { bio: 'Nueva bio' })
  })

  test('responde 400 si se manda el nombre vacío', async () => {
    // Es opcional en una edición, pero si viene tiene que ser válido:
    // artist_name es NOT NULL y "" no es null, así que antes se guardaba.
    const res = await request(app).put('/api/artists/11').field('artist_name', '')

    expect(res.status).toBe(400)
    expect(artistService.updateArtist).not.toHaveBeenCalled()
  })

  test('responde 404 si el artista no existe', async () => {
    artistService.updateArtist.mockResolvedValue(null)

    const res = await request(app).put('/api/artists/999').field('artist_name', 'X')

    expect(res.status).toBe(404)
  })

  test('responde 500 ante un error inesperado del servicio', async () => {
    artistService.updateArtist.mockRejectedValue(new Error('se cayó la base'))

    const res = await request(app).put('/api/artists/11').field('artist_name', 'X')

    expect(res.status).toBe(500)
    expect(res.body.message).toBe('se cayó la base')
  })
})
