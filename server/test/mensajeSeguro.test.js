/**
 * mensajeSeguro: generaliza los 5xx en producción para no filtrar mensajes
 * crudos de Sequelize/Postgres; deja pasar los 4xx (pensados para el usuario)
 * y, en desarrollo, deja todo para poder depurar.
 */
import { mensajeSeguro } from '../src/utils/mensajeSeguro.js'

const conEntorno = (env, fn) => {
  const previo = process.env.NODE_ENV
  process.env.NODE_ENV = env
  try { return fn() } finally { process.env.NODE_ENV = previo }
}

describe('mensajeSeguro', () => {
  test('en producción generaliza un 500 (no filtra el error de Postgres)', () => {
    conEntorno('production', () => {
      const r = mensajeSeguro({ message: 'invalid input syntax for type integer: "x"' })
      expect(r).toBe('Internal server error')
    })
  })

  test('en producción generaliza un error sin status (asume 500)', () => {
    conEntorno('production', () => {
      expect(mensajeSeguro(new Error('notNull Violation: ...'))).toBe('Internal server error')
    })
  })

  test('en producción deja pasar los 4xx (mensaje para el usuario)', () => {
    conEntorno('production', () => {
      const e = Object.assign(new Error('title and genre_id are required'), { status: 400 })
      expect(mensajeSeguro(e)).toBe('title and genre_id are required')
    })
  })

  test('en desarrollo deja pasar el mensaje crudo del 500 (debug)', () => {
    conEntorno('development', () => {
      expect(mensajeSeguro({ message: 'raw sequelize error' })).toBe('raw sequelize error')
    })
  })
})
