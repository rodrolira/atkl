// controllers/artists.controller.js
import Artist from '../models/artist.model.js'
import User from '../models/user.model.js'
import Release from '../models/release.model.js'
import Role from '../models/role.model.js'
import bcrypt from 'bcryptjs'
import ArtistRoles from '../models/artist_role.model.js'
import ReleaseArtist from '../models/release_artist.model.js'

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

const replaceArtistRoles = async (artistId, roleIds) => {
  await ArtistRoles.destroy({ where: { artist_id: artistId } })

  const ids = parseRoleIds(roleIds)
  if (ids.length > 0) {
    await ArtistRoles.bulkCreate(
      ids.map((roleId) => ({ artist_id: artistId, role_id: roleId }))
    )
  }
}

const findArtistWithRoles = (id) =>
  Artist.findByPk(id, {
    include: [{ model: Role, as: 'Roles', through: { attributes: [] } }],
  })

export const addArtist = async (artistData) => {
  if (!artistData.artist_name || !artistData.email) {
    const error = new Error('artist_name y email son obligatorios')
    error.status = 400
    throw error
  }

  let newUserId = null

  if (artistData.email && artistData.username && artistData.password) {
    const existingUser = await User.findOne({ where: { email: artistData.email } })
    if (existingUser) {
      const error = new Error('Ya existe una cuenta con ese email')
      error.status = 409
      throw error
    }

    const newUser = await User.create({
      username: artistData.username,
      email: artistData.email,
      password: await bcrypt.hash(artistData.password, 10),
    })
    newUserId = newUser.id
  }

  const artist = await Artist.create({
    ...pickArtistFields(artistData),
    user_id: newUserId,
  })

  if (artistData.roleIds !== undefined) {
    await replaceArtistRoles(artist.id, artistData.roleIds)
  }

  return findArtistWithRoles(artist.id)
}

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

export const deleteArtist = async (req, res) => {
  const { id } = req.params

  try {
    const artist = await Artist.findOne({ where: { id } })
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' })
    }

    await ArtistRoles.destroy({ where: { artist_id: artist.id } })
    await ReleaseArtist.destroy({ where: { artist_id: artist.id } })
    await Artist.destroy({ where: { id: artist.id } })

    if (artist.user_id) {
      await User.destroy({ where: { id: artist.user_id } })
    }

    res.status(200).json({ message: 'Artist and user account deleted successfully' })
  } catch (error) {
    console.error('Error deleting artist:', error)
    res.status(500).json({ message: error.message })
  }
}

export const getArtists = async (req, res) => {
  try {
    const artists = await Artist.findAll({
      include: [{
        model: Role,
        as: 'Roles',
        through: { attributes: [] },
      }],
    })
    res.status(200).json(artists)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getArtistById = async (req, res) => {
  const { id } = req.params

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: 'Invalid or missing artist ID' })
  }

  try {
    const artist = await Artist.findByPk(id, {
      include: [{ model: Role, as: 'Roles' }],
    })
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' })
    }
    res.status(200).json(artist)
  } catch (error) {
    console.error(`Error fetching artist with ID ${id}:`, error)
    res.status(500).json({ message: error.message })
  }
}

export const getArtistReleases = async (req, res) => {
  const { id } = req.params

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: 'Invalid or missing artist ID' })
  }

  try {
    const artist = await Artist.findByPk(id, {
      include: { model: Release, as: 'releases' },
    })

    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' })
    }

    res.status(200).json(artist.releases)
  } catch (error) {
    console.error(`Error fetching releases for artist ${id}:`, error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
