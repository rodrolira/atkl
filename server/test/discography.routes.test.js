/**
 * Tests de las rutas de discography: mass assignment y tope del lote.
 *
 * Se mockea el modelo (no hay base) y el middleware de admin (no hay token).
 * Lo que se verifica es el contrato de la ruta: que `id` y otros campos ajenos
 * no lleguen al modelo, y que /bulk rechace lotes fuera de rango.
 */
import express from 'express'
import request from 'supertest'
import Discography from '../src/models/discography.model.js'

jest.mock('../src/models/discography.model.js', () => ({
  __esModule: true,
  default: {
    create: jest.fn(async (data) => ({ id: 1, ...data })),
    bulkCreate: jest.fn(async (rows) => rows.map((r, i) => ({ id: i + 1, ...r }))),
    update: jest.fn(async () => [1]),
    findByPk: jest.fn(async () => ({ id: 1 })),
  },
}))

jest.mock('../src/middlewares/verifyTokenAdmin.js', () => ({
  verifyTokenAdmin: (req, res, next) => next(),
}))

import discographyRouter from '../src/routes/discography.routes.js'

const app = express()
app.use(express.json())
app.use('/api', discographyRouter)

beforeEach(() => jest.clearAllMocks())

describe('POST /api/discography (mass assignment)', () => {
  test('descarta id y campos ajenos; solo pasan los permitidos', async () => {
    const res = await request(app)
      .post('/api/discography')
      .send({ id: 7777, title: 'Tema', artist: 'X', createdAt: '1990-01-01', hackeado: true })

    expect(res.status).toBe(201)
    const datos = Discography.create.mock.calls[0][0]
    expect(datos).toEqual({ title: 'Tema', artist: 'X' })
    expect(datos.id).toBeUndefined()
    expect(datos.createdAt).toBeUndefined()
    expect(datos.hackeado).toBeUndefined()
  })
})

describe('POST /api/discography/bulk (tope de lote)', () => {
  test('inserta un lote válido ya saneado', async () => {
    const res = await request(app)
      .post('/api/discography/bulk')
      .send([{ id: 99, title: 'A', artist: 'X' }, { title: 'B' }])

    expect(res.status).toBe(201)
    const filas = Discography.bulkCreate.mock.calls[0][0]
    expect(filas[0]).toEqual({ title: 'A', artist: 'X' })
    expect(filas[0].id).toBeUndefined()
  })

  test('rechaza un lote vacío', async () => {
    const res = await request(app).post('/api/discography/bulk').send([])
    expect(res.status).toBe(400)
    expect(Discography.bulkCreate).not.toHaveBeenCalled()
  })

  test('rechaza un lote de más de 500 registros', async () => {
    const lote = Array.from({ length: 501 }, (_, i) => ({ title: 't' + i }))
    const res = await request(app).post('/api/discography/bulk').send(lote)
    expect(res.status).toBe(400)
    expect(Discography.bulkCreate).not.toHaveBeenCalled()
  })

  test('rechaza un body que no es lista', async () => {
    const res = await request(app).post('/api/discography/bulk').send({ title: 'x' })
    expect(res.status).toBe(400)
  })
})
