// server/controllers/releases.controller.js
import Release from '../models/release.model.js'
import Artist from '../models/artist.model.js' // Importa el modelo Artist
import Genre from '../models/genre.model.js' // Importa el modelo Genre
import ReleaseArtist from '../models/release_artist.model.js'

const parseArtistIds = (artistId) => {
  const values = Array.isArray(artistId)
    ? artistId
    : artistId !== undefined && artistId !== null && artistId !== ''
      ? [artistId]
      : []

  return values
    .flatMap((value) => String(value).split(','))
    .map((value) => parseInt(value.trim(), 10))
    .filter((value) => !Number.isNaN(value))
}

export const addRelease = async (req, res) => {
  const {
    title,
    release_date,
    description,
    genre_id,
    release_type,
    artist_id,
    bandcamp_link,
    beatport_link,
    spotify_link,
    apple_music_link,
    youtube_link,
    soundcloud_link,
  } = req.body;

  try {
    // multer-storage-cloudinary ya subió la imagen y dejó su URL en file.path
    const cover_image_url = req.file ? req.file.path : null
    const artistIds = parseArtistIds(artist_id)

    // Validar campos obligatorios
    if (!title || !genre_id) {
      return res.status(400).json({ message: 'title and genre_id are required' });
    }

    // Crear el release
    const newRelease = await Release.create({
      title,
      release_date,
      description,
      genre_id,
      release_type,
      cover_image_url,
      bandcamp_link,
      beatport_link,
      spotify_link,
      apple_music_link,
      youtube_link,
      soundcloud_link,
    });

    // Asociar artistas con el lanzamiento
    if (artistIds.length > 0) {
      await newRelease.setArtists(artistIds);
    }

    // Obtener el lanzamiento con los artistas asociados
    const releaseWithArtists = await Release.findOne({
      where: { id: newRelease.id },
      include: {
        model: Artist,
        as: 'artists',
        attributes: ['id', 'artist_name'],
      },
    });

    res.status(201).json(releaseWithArtists);
  } catch (error) {
    console.error('Error adding release:', error);
    res.status(500).json({ message: 'Failed to add release', error: error.message });
  }
};

export const getReleases = async (req, res) => {
  try {
    const releases = await Release.findAll({
      include: [
        {
          model: Artist,
          as: 'artists',
        },
        {
          model: Genre,
          as: 'genre',
          attributes: ['id', 'name'],
        },
      ],
    })
    res.status(200).json(releases)
  } catch (error) {
    if (error.message === 'Artist is not associated to Release!') {
      res.status(400).json({ message: 'Artist is not associated to Release!' })
    } else {
      res.status(500).json({ message: error.message })
    }
  }
}

export const getReleaseById = async (req, res) => {
  const { id } = req.params

  try {
    const release = await Release.findByPk(id, {
      include: [
        {
          model:
            Genre, as: 'genre', attributes: ['name']
        },
        {
          model:
            Artist, as: 'artists'
        }],
    })
    if (!release) {
      return res.status(404).json({ message: 'Release not found' })
    }

    res.status(200).json(release)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateRelease = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    release_date,
    description,
    genre_id,
    release_type,
    artist_id,
    bandcamp_link,
    beatport_link,
    spotify_link,
    apple_music_link,
    youtube_link,
    soundcloud_link,
  } = req.body;

  try {
    const artistIds = parseArtistIds(artist_id)

    // Validar campos obligatorios
    if (!title || artistIds.length === 0) {
      return res.status(400).json({ message: 'title and at least one artist_id are required' });
    }

    const updateFields = {
      title,
      release_date,
      description,
      genre_id,
      release_type,
      bandcamp_link,
      beatport_link,
      spotify_link,
      apple_music_link,
      youtube_link,
      soundcloud_link,
    };

    // Solo reemplazar la portada cuando se subió una nueva imagen
    if (req.file) {
      updateFields.cover_image_url = req.file.path;
    }

    // Actualizar el release
    const [affectedCount, [updatedRelease]] = await Release.update(
      updateFields,
      {
        where: { id },
        returning: true,
      }
    );

    if (affectedCount === 0) {
      return res.status(404).json({ message: 'Release not found' });
    }

    // Asociar artistas con el lanzamiento
    await updatedRelease.setArtists(artistIds);

    res.status(200).json(updatedRelease);
  } catch (error) {
    console.error('Error updating release:', error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteRelease = async (req, res) => {
  try {
    const { id } = req.params
    const release = await Release.findByPk(id)
    if (!release) {
      return res.status(404).json({ message: 'Release not found' })
    }
    // Limpiar la tabla intermedia antes de borrar el release
    await ReleaseArtist.destroy({ where: { release_id: id } })
    // Eliminar el release de la base de datos
    await Release.destroy({
      where: {
        id,
      },
    })

    res.status(200).json({ message: 'Release deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
