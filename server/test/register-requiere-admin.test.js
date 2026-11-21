/**
 * POST /api/register ya no permite crear cuentas sin autenticación.
 *
 * El producto no tiene registro público; el endpoint abierto dejaba llenar la
 * tabla de usuarios. Ahora exige token de admin (verifyTokenAdmin).
 */
import express from 'express'
import request from 'supertest'
import * as userController from '../src/controllers/auth.controller.js'

jest.mock('../src/controllers/auth.controller.js', () => ({
  register: jest.fn((req, res) => res.status(201).json({ message: 'ok' })),
  login: jest.fn((req, res) => res.status(200).json({})),
  logout: jest.fn((req, res) => res.status(200).json({})),
  profile: jest.fn((req, res) => res.status(200).json({})),
  verify: jest.fn((req, res) => res.status(200).json({})),
}))

// Admin válido = next(); inválido = 401. Simula verifyTokenAdmin real.
jest.mock('../src/middlewares/verifyTokenAdmin.js', () => ({
  verifyTokenAdmin: (req, res, next) =>
    req.headers.authorization === 'Bearer admin-ok'
      ? next()
      : res.status(401).json({ message: 'Unauthorized' }),
}))

jest.mock('../src/middlewares/auth.middleware.js', () => ({
  verifyTokenUser: (req, res, next) => next(),
}))

import authRouter from '../src/routes/auth.routes.js'

const app = express()
app.use(express.json())
app.use('/api', authRouter)

beforeEach(() => jest.clearAllMocks())

test('sin token -> 401 y no se crea la cuenta', async () => {
  const res = await request(app)
    .post('/api/register')
    .send({ username: 'atacante', email: 'a@evil.test', password: 'Pass123!' })
  expect(res.status).toBe(401)
  expect(userController.register).not.toHaveBeenCalled()
})

test('con token de admin -> procede', async () => {
  const res = await request(app)
    .post('/api/register')
    .set('Authorization', 'Bearer admin-ok')
    .send({ username: 'nuevo', email: 'n@ok.test', password: 'Pass123!' })
  expect(res.status).toBe(201)
  expect(userController.register).toHaveBeenCalledTimes(1)
})
