/**
 * Tests de cómo se arma la configuración de Cloudinary.
 *
 * El panel entrega las credenciales de dos formas y el .env del proyecto usó
 * las dos. Con CLOUDINARY_URL cargada y las tres sueltas ausentes, pasarle al
 * SDK un objeto lleno de `undefined` le pisaba la configuración que ya había
 * armado y toda subida moría con "Must supply cloud_name".
 *
 * `loadEnv` va mockeado para que el .env real de la máquina no se meta.
 */
jest.mock('../config/loadEnv.js', () => ({ loadEnv: () => {} }))

const VARIABLES = [
  'CLOUDINARY_URL',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
]

const original = {}

beforeAll(() => {
  for (const nombre of VARIABLES) original[nombre] = process.env[nombre]
})

beforeEach(() => {
  jest.resetModules()
  for (const nombre of VARIABLES) delete process.env[nombre]
})

afterAll(() => {
  for (const nombre of VARIABLES) {
    if (original[nombre] === undefined) delete process.env[nombre]
    else process.env[nombre] = original[nombre]
  }
})

describe('config/cloudinary', () => {
  test('arma la config desde CLOUDINARY_URL cuando no están las tres sueltas', () => {
    process.env.CLOUDINARY_URL = 'cloudinary://111222333:secreto-de-prueba@cuenta-prueba'

    const cloudinary = require('../config/cloudinary.js').default

    expect(cloudinary.config().cloud_name).toBe('cuenta-prueba')
    expect(cloudinary.config().api_key).toBe('111222333')
    expect(cloudinary.config().api_secret).toBe('secreto-de-prueba')
  })

  test('las tres sueltas mandan sobre CLOUDINARY_URL', () => {
    process.env.CLOUDINARY_URL = 'cloudinary://111222333:secreto-de-prueba@cuenta-prueba'
    process.env.CLOUDINARY_CLOUD_NAME = 'cuenta-suelta'
    process.env.CLOUDINARY_API_KEY = '999'
    process.env.CLOUDINARY_API_SECRET = 'otro-secreto'

    const cloudinary = require('../config/cloudinary.js').default

    expect(cloudinary.config().cloud_name).toBe('cuenta-suelta')
    expect(cloudinary.config().api_secret).toBe('otro-secreto')
  })

  // Una sola de las tres no alcanza para firmar: si se tomara igual, se perdía
  // la URL completa y volvía el "Must supply cloud_name".
  test('con las sueltas incompletas usa igual CLOUDINARY_URL', () => {
    process.env.CLOUDINARY_URL = 'cloudinary://111222333:secreto-de-prueba@cuenta-prueba'
    process.env.CLOUDINARY_CLOUD_NAME = 'cuenta-suelta'

    const cloudinary = require('../config/cloudinary.js').default

    expect(cloudinary.config().cloud_name).toBe('cuenta-prueba')
  })
})
