/**
 * El logout tiene que invalidar el token, no solo borrar la cookie.
 *
 * El cliente guarda el JWT en localStorage y lo manda por Authorization, así
 * que antes de este fix cerrar sesión no servía de nada: el mismo token seguía
 * entrando al panel hasta vencer. Se verifica el ciclo completo con el
 * middlewrae real (verifyTokenAdmin) y la lista de revocados real.
 */
import jwt from 'jsonwebtoken'
import { verifyTokenAdmin } from '../src/middlewares/verifyTokenAdmin.js'
import { revokeToken, clearRevokedTokens } from '../src/middlewares/tokenBlacklist.js'

const SECRET = 'secreto-de-test-para-firmar-jwt-123456'

const correr = (token) => {
  const req = { cookies: {}, headers: { authorization: `Bearer ${token}` } }
  let status = null
  const res = {
    status(c) { status = c; return this },
    json() { return this },
  }
  let llamoNext = false
  verifyTokenAdmin(req, res, () => { llamoNext = true })
  return { status, llamoNext, adminId: req.adminId }
}

beforeAll(() => { process.env.SECRET = SECRET })
beforeEach(() => clearRevokedTokens())

test('un token válido pasa antes del logout', () => {
  const token = jwt.sign({ adminId: 1, role: 'admin' }, SECRET, { expiresIn: '1h' })
  const r = correr(token)
  expect(r.llamoNext).toBe(true)
  expect(r.adminId).toBe(1)
})

test('el mismo token queda rechazado tras revocarlo (logout)', () => {
  const token = jwt.sign({ adminId: 1, role: 'admin' }, SECRET, { expiresIn: '1h' })
  expect(correr(token).llamoNext).toBe(true)

  revokeToken(token)

  const r = correr(token)
  expect(r.llamoNext).toBe(false)
  expect(r.status).toBe(401)
})
