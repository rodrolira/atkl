/**
 * Tests de hardening a nivel app (app.js), sin tocar la base de datos.
 *
 * app.js no abre conexión al importarse (sequelize.js solo construye la
 * instancia; conecta en index.js con .sync). Por eso se puede montar la app
 * entera con supertest y verificar cabeceras sobre una ruta pública.
 */
import request from 'supertest'
import app from '../app.js'

describe('cabeceras de seguridad', () => {
  test('no expone X-Powered-By', async () => {
    const res = await request(app).get('/')
    expect(res.headers['x-powered-by']).toBeUndefined()
  })

  test('manda las cabeceras de seguridad base', async () => {
    const res = await request(app).get('/')
    expect(res.headers['x-content-type-options']).toBe('nosniff')
    expect(res.headers['x-frame-options']).toBe('DENY')
    expect(res.headers['strict-transport-security']).toMatch(/max-age=\d+/)
  })
})
