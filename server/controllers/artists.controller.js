// server/controllers/artists.controller.js
import Artist from '../models/artist.model.js'
import Release from '../models/release.model.js'
import User from '../models/user.model.js'
import Role from '../models/role.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import sequelize from '../db/sequelize.js'

dotenv.config()

export const addArtist = async (req, res) => {
  const {
    artist_name,
    email,
    username,
    password,
    bio,
    roleIds, // List of role IDs
    bandcamp_link,
    facebook_link,
    instagram_link,
    soundcloud_link,
    twitter_link,
    youtube_link,
    spotify_link,
    apple_music_link,
    beatport_link,
  } = req.body
  // Verifica si hay un archivo subido
  const image = req.file ? req.file.path : null

  if (!artist_name || !email || !password) {
    return res.status(400).json({
      message: 'artist_name, email, and password are required',
    })
  }

  const transaction = await sequelize.transaction()

  try {
    // Verificar si el correo electrónico ya está en uso
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      await transaction.rollback()
      return res.status(400).json({ message: 'Email already in use' })
    }

    // Crear usuario
    const newUser = await User.create({
      username,
      email,
      password: await bcrypt.hash(password, 10),
    }, { transaction })

    // Crear artista asociado al usuario
    const newArtist = await Artist.create({
      artist_name,
      user_id: newUser.id,
      email,
      roleIds, // List of role IDs
      bio,
      image,
      bandcamp_link,
      facebook_link,
      instagram_link,
      soundcloud_link,
      twitter_link,
      youtube_link,
      spotify_link,
      apple_music_link,
      beatport_link,
    }, { transaction })

    // Asociar roles con el artista
    if (roleIds && roleIds.length > 0) {
      const roles = await Role.findAll({
        where: {
          id: roleIds,
        },
        transaction
      })
      await newArtist.addRoles(roles, { transaction })
    }

    // Commit transaction
    await transaction.commit()

    const token = jwt.sign({ email }, process.env.SECRET, { expiresIn: '12h' })

    res.cookie('token', token, { httpOnly: true })

    console.log('New artist created:', newArtist)

    res.status(201).json(newArtist)
  } catch (error) {
    await transaction.rollback()
    console.error(`Error adding artist: ${error.message}`, error)
    return res
      .status(500)
      .json({ message: error.message, details: error.stack })
  }
}

export const updateArtist = async (req, res) => {
  const { id } = req.params
  const updateData = req.body

  try {
    // Actualizar datos del artista
    await Artist.update(updateData, { where: { id } })

    // Actualizar roles si se proporcionan
    if (updateData.roleIds) {
      const roleIds = updateData.roleIds.split(',').map(id => parseInt(id, 10))
      const artist = await Artist.findByPk(id)
      const roles = await Role.findAll({ where: { id: roleIds } })
      await artist.setRoles(roles)
    }

    // Obtener el artista actualizado
    const updatedArtist = await Artist.findByPk(id, {
      include: [Role] // Incluye roles asociados
    })

    res.json(updatedArtist)
  } catch (error) {
    console.error('Error updating artist:', error)
    res.status(500).json({ message: 'Error updating artist' })
  }
}

export const deleteArtist = async (req, res) => {
  try {
    const { id } = req.params
    const artist = await Artist.findByPk(id)
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' })
    }
    // Delete artist
    await Artist.destroy({
      where: {
        id,
      },
    })

    // Delete user account
    await User.destroy({
      where: {
        id: artist.user_id,
      },
    })
    res
      .status(200)
      .json({ message: 'Artist and user account deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getArtists = async (req, res) => {
  try {
    const artists = await Artist.findAll()
    res.status(200).json(artists)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getArtistById = async (req, res) => {
  const { id } = req.params

  try {
    const artist = await Artist.findByPk(id, {
      include: {
        model: Role,
        as: 'Roles',
      },
    })
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' })
    }
    res.status(200).json(artist)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getArtistReleases = async (req, res) => {
  const { id } = req.params

  try {
    const artist = await Artist.findByPk(id, {
      include: {
        model: Release,
        as: 'releases',
      } // Incluye los lanzamientos asociados al artista
    })

    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' })
    }

    res.status(200).json(artist.releases) // Devuelve los lanzamientos del artista
  } catch (error) {
    console.error('Error fetching artist releases:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
