import {
  addArtist,
  updateArtist,
  deleteArtist,
} from '../src/controllers/artists.controller.js'

import * as artistService from '../src/services/artistService.js'

jest.mock('../src/services/artistService.js', () => ({
  addArtist: jest.fn(),
  updateArtist: jest.fn(),
  deleteArtist: jest.fn(),
}))

const mockResponse = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('addArtist', () => {
  test('returns 201 with the created artist', async () => {
    const created = { id: 3, artist_name: 'Nova' }
    artistService.addArtist.mockResolvedValue(created)
    const res = mockResponse()

    await addArtist({ body: { artist_name: 'Nova', email: 'nova@example.com' } }, res)

    expect(artistService.addArtist).toHaveBeenCalledWith({
      artist_name: 'Nova',
      email: 'nova@example.com',
    })
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(created)
  })

  test('returns 400 when the service throws a validation error', async () => {
    const error = new Error('artist_name y email son obligatorios')
    error.status = 400
    artistService.addArtist.mockRejectedValue(error)
    const res = mockResponse()

    await addArtist({ body: { artist_name: 'No mail' } }, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ message: 'artist_name y email son obligatorios' })
  })

  test('returns 500 on unexpected errors', async () => {
    artistService.addArtist.mockRejectedValue(new Error('DB error'))
    const res = mockResponse()

    await addArtist({ body: { artist_name: 'X', email: 'x@y.com' } }, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'DB error' })
  })
})

describe('updateArtist', () => {
  test('returns 200 with the updated artist', async () => {
    const updated = { id: 5, artist_name: 'Renamed' }
    artistService.updateArtist.mockResolvedValue(updated)
    const res = mockResponse()

    await updateArtist({ params: { id: '5' }, body: { artist_name: 'Renamed' } }, res)

    expect(artistService.updateArtist).toHaveBeenCalledWith('5', {
      artist_name: 'Renamed',
    })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(updated)
  })

  test('returns 404 when the artist does not exist', async () => {
    const error = new Error('Artist not found')
    error.status = 404
    artistService.updateArtist.mockRejectedValue(error)
    const res = mockResponse()

    await updateArtist({ params: { id: '999' }, body: {} }, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })
})

describe('deleteArtist', () => {
  test('returns 200 when the artist is deleted', async () => {
    artistService.deleteArtist.mockResolvedValue({ id: 5 })
    const res = mockResponse()

    await deleteArtist({ params: { id: '5' } }, res)

    expect(artistService.deleteArtist).toHaveBeenCalledWith('5')
    expect(res.status).toHaveBeenCalledWith(200)
  })

  test('returns 404 when the artist does not exist', async () => {
    const error = new Error('Artist not found')
    error.status = 404
    artistService.deleteArtist.mockRejectedValue(error)
    const res = mockResponse()

    await deleteArtist({ params: { id: '999' } }, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })
})
