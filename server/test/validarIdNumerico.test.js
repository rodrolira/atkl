/**
 * Tests del middleware que valida los :id numéricos.
 *
 * El bug que cubre: un :id no numérico llegaba a `findByPk`, Postgres
 * respondía "invalid input syntax for type integer: ..." y ese mensaje crudo
 * se filtraba al cliente (fuga de información del motor). El middleware corta
 * antes de tocar la base y devuelve 400.
 */
import { validarIdNumerico } from '../src/middlewares/validarIdNumerico.js'

const correr = (valor, nombre = 'id') => {
  const req = { params: { [nombre]: valor } }
  let status = null
  let body = null
  const res = {
    status(c) { status = c; return this },
    json(b) { body = b; return this },
  }
  let llamoNext = false
  validarIdNumerico(nombre)(req, res, () => { llamoNext = true })
  return { status, body, llamoNext }
}

describe('validarIdNumerico', () => {
  test('deja pasar un entero positivo', () => {
    const r = correr('42')
    expect(r.llamoNext).toBe(true)
    expect(r.status).toBeNull()
  })

  test.each([
    ['notanumber'],
    ['1abc'],
    ["1' OR '1'='1"],
    ['{"$ne":null}'],
    ['-5'],
    ['0'],
    ['1.5'],
    ['1e9'],
    ['0x1f'],
    [''],
    ['99999999999999999999'], // fuera de rango de entero seguro
  ])('rechaza %j con 400 y sin tocar la base', (valor) => {
    const r = correr(valor)
    expect(r.llamoNext).toBe(false)
    expect(r.status).toBe(400)
    expect(r.body).toEqual({ message: 'id inválido' })
  })
})
