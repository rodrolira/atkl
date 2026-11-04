import Artist from '../models/artist.model.js'
import User from '../models/user.model.js'
import Role from '../models/role.model.js'
import ArtistRoles from '../models/artist_role.model.js'
import ReleaseArtist from '../models/release_artist.model.js'
import Release from '../models/release.model.js'
import bcrypt from 'bcryptjs'
import sequelize from '../../db/sequelize.js'

const ARTIST_FIELDS = [
  'artist_name',
  'email',
  'bio',
  'image',
  'bandcamp_link',
  'facebook_link',
  'instagram_link',
  'soundcloud_link',
  'twitter_link',
  'youtube_link',
  'spotify_link',
  'apple_music_link',
  'beatport_link',
]

const pickArtistFields = (data) => {
  const fields = {}
  for (const key of ARTIST_FIELDS) {
    if (data[key] !== undefined) {
      fields[key] = data[key]
    }
  }
  return fields
}

const parseRoleIds = (roleIds) => {
  if (Array.isArray(roleIds)) {
    return roleIds.flatMap((roleId) => parseRoleIds(roleId))
  }
  if (typeof roleIds === 'number' && !Number.isNaN(roleIds)) {
    return [roleIds]
  }
  if (typeof roleIds === 'string' && roleIds.trim() !== '') {
    return roleIds
      .split(',')
      .map((roleId) => parseInt(roleId.trim(), 10))
      .filter((roleId) => !Number.isNaN(roleId))
  }
  return []
}

const replaceArtistRoles = async (artistId, roleIds, transaction) => {
  await ArtistRoles.destroy({ where: { artist_id: artistId }, transaction })

  const ids = parseRoleIds(roleIds)
  if (ids.length > 0) {
    await ArtistRoles.bulkCreate(
      ids.map((roleId) => ({ artist_id: artistId, role_id: roleId })),
      { transaction }
    )
  }
}

const findArtistWithRoles = (id, transaction) =>
  Artist.findByPk(id, {
    include: [{ model: Role, as: 'Roles', through: { attributes: [] } }],
    transaction,
  })

/**
 * Crea un artista (y opcionalmente su cuenta de usuario) dentro de una transacción.
 * @param {Object} artistData - Datos del artista
 * @returns {Promise<Object>} Artista creado con sus roles
 */
export const addArtist = async (artistData) => {
  if (!artistData.artist_name || !artistData.email) {
    const error = new Error('artist_name y email son obligatorios')
    error.status = 400
    throw error
  }

  return sequelize.transaction(async (transaction) => {
    let newUserId = null

    if (artistData.email && artistData.username && artistData.password) {
      const existingUser = await User.findOne({
        where: { email: artistData.email },
        transaction,
      })
      if (existingUser) {
        const error = new Error('Ya existe una cuenta con ese email')
        error.status = 409
        throw error
      }

      const newUser = await User.create(
        {
          username: artistData.username,
          email: artistData.email,
          password: await bcrypt.hash(artistData.password, 10),
        },
        { transaction }
      )
      newUserId = newUser.id
    }

    const artist = await Artist.create(
      {
        ...pickArtistFields(artistData),
        user_id: newUserId,
      },
      { transaction }
    )

    if (artistData.roleIds !== undefined) {
      await replaceArtistRoles(artist.id, artistData.roleIds, transaction)
    }

    return findArtistWithRoles(artist.id, transaction)
  })
}

/**
 * Actualiza un artista y sus roles.
 * @param {number} id - ID del artista
 * @param {Object} artistData - Datos a actualizar
 * @returns {Promise<Object>} Artista actualizado con sus roles
 */
export const updateArtist = async (id, artistData) => {
  const fields = pickArtistFields(artistData)

  if (Object.keys(fields).length > 0) {
    await Artist.update(fields, { where: { id } })
  }

  if (artistData.roleIds !== undefined) {
    await replaceArtistRoles(id, artistData.roleIds)
  }

  return findArtistWithRoles(id)
}

/**
 * Elimina un artista, sus roles, sus enlaces a releases y su cuenta de usuario.
 * @param {number} id - ID del artista
 * @returns {Promise<Object>} Artista eliminado (para verificar existencia)
 */
export const deleteArtist = async (id) => {
  const artist = await Artist.findOne({ where: { id } })
  if (!artist) {
    const error = new Error('Artist not found')
    error.status = 404
    throw error
  }

  await ArtistRoles.destroy({ where: { artist_id: artist.id } })
  await ReleaseArtist.destroy({ where: { artist_id: artist.id } })
  await Artist.destroy({ where: { id: artist.id } })

  if (artist.user_id) {
    await User.destroy({ where: { id: artist.user_id } })
  }

  return artist
}

/**
 * Obtiene la lista paginada de artistas con sus roles.
 * @param {number} page - Número de página
 * @param {number} limit - Cantidad por página
 * @returns {Promise<{ artists: Object[], pagination: Object }>}
 */
export const getArtists = async (page, limit) => {
  const offset = (page - 1) * limit

  const { count, rows: artists } = await Artist.findAndCountAll({
    include: [{
      model: Role,
      as: 'Roles',
      through: { attributes: [] },
    }],
    limit,
    offset,
  })

  return {
    artists,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  }
}

/**
 * Obtiene un artista por ID con sus roles.
 * @param {number} id - ID del artista
 * @returns {Promise<Object>} Artista encontrado
 */
export const getArtistById = async (id) => {
  const artist = await Artist.findByPk(id, {
    include: [{ model: Role, as: 'Roles' }],
  })
  if (!artist) {
    const error = new Error('Artist not found')
    error.status = 404
    throw error
  }
  return artist
}

/**
 * Obtiene los releases de un artista.
 * @param {number} id - ID del artista
 * @returns {Promise<Object[]>} Lista de releases
 */
export const getArtistReleases = async (id) => {
  const artist = await Artist.findByPk(id, {
    include: { model: Release, as: 'releases' },
  })

  if (!artist) {
    const error = new Error('Artist not found')
    error.status = 404
    throw error
  }

  return artist.releases
}
