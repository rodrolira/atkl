/**
 * Tests de updateRelease sobre el servicio (los modelos van mockeados: estos
 * tests no tocan la base).
 *
 * Existen por los dos cambios que necesitaba el panel para acreditar artistas
 * que no están en la base:
 *   - `artist_credit` no se guardaba nunca desde la API; se escribía solo al
 *     importar de Bandcamp o al borrar una ficha.
 *   - los vínculos solo se sincronizaban si venía al menos un artista, así que
 *     quitar el último no tenía efecto y volvía a aparecer al recargar.
 */
import { updateRelease } from '../src/services/releaseService.js'
import Release from '../src/models/release.model.js'

jest.mock('../src/models/release.model.js', () => ({
  update: jest.fn(),
  findByPk: jest.fn(),
  findOne: jest.fn(),
}))

jest.mock('../src/models/artist.model.js', () => ({}))
jest.mock('../src/models/genre.model.js', () => ({}))
jest.mock('../src/models/release_artist.model.js', () => ({ destroy: jest.fn() }))

const base = { title: 'Two Sides' }

let setArtists

beforeEach(() => {
  jest.clearAllMocks()
  setArtists = jest.fn()
  Release.update.mockResolvedValue([1])
  Release.findByPk.mockResolvedValue({ id: 11, setArtists })
  Release.findOne.mockResolvedValue({ id: 11 })
})

const camposGuardados = () => Release.update.mock.calls[0][0]

describe('updateRelease', () => {
  test('guarda el crédito que manda el formulario', async () => {
    await updateRelease(11, { ...base, artist_credit: 'BbaphometT, thunder21, KURSE' })

    expect(camposGuardados().artist_credit).toBe('BbaphometT, thunder21, KURSE')
  })

  test('un crédito vacío borra el valor en vez de dejar el anterior', async () => {
    await updateRelease(11, { ...base, artist_credit: '' })

    expect(camposGuardados().artist_credit).toBeNull()
  })

  // Un formulario viejo que no manda el campo no debe borrar el crédito.
  test('sin el campo no toca el crédito', async () => {
    await updateRelease(11, base)

    expect(camposGuardados()).not.toHaveProperty('artist_credit')
  })

  test('vincula los artistas que vienen en la petición', async () => {
    await updateRelease(11, { ...base, artist_id: ['6', '11'] })

    expect(setArtists).toHaveBeenCalledWith([6, 11])
  })

  test('una lista vacía desvincula al último artista', async () => {
    await updateRelease(11, { ...base, artist_id: '' })

    expect(setArtists).toHaveBeenCalledWith([])
  })

  test('sin el campo no toca los vínculos', async () => {
    await updateRelease(11, base)

    expect(setArtists).not.toHaveBeenCalled()
  })
})
