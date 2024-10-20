// server/controllers/artists.controller.js
import Artist from '../models/artist.model.js';
import User from '../models/user.model.js';
import Release from '../models/release.model.js';
import Role from '../models/role.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import ArtistRoles from '../models/artist_role.model.js';
dotenv.config();

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
  } = req.body;

  const image = req.file ? req.file.path : null;

  if (!artist_name || !email || !password) {
    return res.status(400).json({ message: 'artist_name, email, and password are required' });
  }
  console.log('Image path:', image); // Para verificar si la imagen se subió correctamente

  try {
    const newUser = await User.create({
      username,
      email,
      password: await bcrypt.hash(password, 10),
    });

    const newArtist = await Artist.create({
      artist_name,
      user_id: newUser.id,
      email,
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
    });

    const token = jwt.sign({ email }, process.env.SECRET, { expiresIn: '12h' });
    res.cookie('token', token, { httpOnly: true });

    console.log('New artist created:', newArtist);
    res.status(201).json(newArtist);
  } catch (error) {
    console.error(`Error adding artist: ${error.message}`, error);
    return res.status(500).json({ message: error.message, details: error.stack });
  }
};

export const updateArtist = async (req, res) => {
  const { artistId } = req.params;
  let { roleIds, ...updateData } = req.body;

  if (req.file) {
    updateData.image = req.file.path;
  }

  if (!artistId) {
    return res.status(400).json({ message: 'Artist ID is required' });
  }

  try {
    await Artist.update(updateData, {
      where: { id: artistId },
    });

    // Si se proporcionan roleIds, actualizar los roles
    if (roleIds) {
      // Asegurarse de que roleIds es un arreglo
      if (typeof roleIds === 'string') {
        roleIds = roleIds.split(',').map((id) => parseInt(id, 10));
      } else if (!Array.isArray(roleIds)) {
        roleIds = [parseInt(roleIds, 10)];
      }

      // Eliminar los roles existentes del artista
      await ArtistRoles.destroy({ where: { artist_id: artistId } });

      // Asignar los nuevos roles
      const artistRoles = roleIds.map((roleId) => ({ artist_id: artistId, role_id: roleId }));
      await ArtistRoles.bulkCreate(artistRoles);
    }

    const updatedArtist = await Artist.findByPk(artistId, {
      include: [{
        model: Role, 
        as: 'Roles',
        through: { attributes: [ 
          'role_id',
          'artist_id',
        ] },
      }],
    });


      res.json(updatedArtist);
    } catch (error) {
      console.error('Error updating artist:', error);
      res.status(500).json({ message: 'Error updating artist' });
    }
  };

  export const deleteArtist = async (req, res) => {
    try {
      const { id } = req.params;
      await Artist.destroy({ where: { id } });
      await User.destroy({ where: { id } });

      res.status(200).json({ message: 'Artist and user account deleted successfully' });
    } catch (error) {
      console.error('Error deleting artist:', error);
      res.status(500).json({ message: error.message });
    }
  };

  export const getArtists = async (req, res) => {

    try { 
      const artists  =  await  Artist.findAll({
        include: [{ model: Role, 
          as: 'Roles',
          through: { attributes: [] },
        }],
      });
      res.status(200).json(artists);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const getArtistById = async (req, res) => {
    const { id } = req.params;

    try {
      const artist = await Artist.findByPk(id, {
        include: [{ model: Role, as: 'Roles' }],
      });
      if (!artist) {
        return res.status(404).json({ message: 'Artist not found' });
      }
      res.status(200).json(artist);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const getArtistReleases = async (req, res) => {
    const { id } = req.params;

    try {
      const artist = await Artist.findByPk(id, {
        include: { model: Release, as: 'releases' },
      });

      if (!artist) {
        return res.status(404).json({ message: 'Artist not found' });
      }

      res.status(200).json(artist.releases);
    } catch (error) {
      console.error('Error fetching artist releases:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };