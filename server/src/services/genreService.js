import Genre from '../models/genre.model.js'

export const getAllGenres = async () => {
  return await Genre.findAll()
}

export const getGenreById = async (id) => {
  const genre = await Genre.findByPk(id)
  if (!genre) {
    const error = new Error('Genre not found')
    error.status = 404
    throw error
  }
  return genre
}

export const createGenre = async (data) => {
  const { name } = data
  if (!name) {
    const error = new Error('name is required')
    error.status = 400
    throw error
  }
  return await Genre.create({ name })
}

export const updateGenre = async (id, data) => {
  const { name } = data
  const [updated] = await Genre.update({ name }, { where: { id } })
  if (!updated) {
    const error = new Error('Genre not found')
    error.status = 404
    throw error
  }
  return await Genre.findByPk(id)
}

export const deleteGenre = async (id) => {
  const deleted = await Genre.destroy({ where: { id } })
  if (!deleted) {
    const error = new Error('Genre not found')
    error.status = 404
    throw error
  }
  return { message: 'Genre deleted successfully' }
}
