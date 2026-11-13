import Release from '../models/release.model.js'
import Artist from '../models/artist.model.js'
import Genre from '../models/genre.model.js'
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

export const addRelease = async (releaseData, filePath) => {
  const { title, genre_id, artist_id, release_date, description, release_type } = releaseData

  if (!title || !genre_id) {
    const error = new Error('title and genre_id are required')
    error.status = 400
    throw error
  }

  const newRelease = await Release.create({
    title,
    release_date,
    description,
    genre_id,
    release_type,
    cover_image_url: filePath || null,
    bandcamp_link: releaseData.bandcamp_link,
    bandcamp_album_id: releaseData.bandcamp_album_id || null,
    bandcamp_track_count: releaseData.bandcamp_track_count || null,
    beatport_link: releaseData.beatport_link,
    spotify_link: releaseData.spotify_link,
    apple_music_link: releaseData.apple_music_link,
    youtube_link: releaseData.youtube_link,
    soundcloud_link: releaseData.soundcloud_link,
  })

  const artistIds = parseArtistIds(artist_id)
  if (artistIds.length > 0) {
    await newRelease.setArtists(artistIds)
  }

  return Release.findOne({
    where: { id: newRelease.id },
    include: [
      { model: Artist, as: 'artists', attributes: ['id', 'artist_name'] },
      { model: Genre, as: 'genre', attributes: ['id', 'name'] },
    ],
  })
}

export const getReleases = async (page, limit) => {
  const offset = (page - 1) * limit

  const { count, rows: releases } = await Release.findAndCountAll({
    include: [
      { model: Artist, as: 'artists' },
      { model: Genre, as: 'genre', attributes: ['id', 'name'] },
    ],
    limit,
    offset,
  })

  return {
    releases,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  }
}

export const getReleaseById = async (id) => {
  const release = await Release.findByPk(id, {
    include: [
      { model: Genre, as: 'genre', attributes: ['name'] },
      { model: Artist, as: 'artists' },
    ],
  })
  if (!release) {
    const error = new Error('Release not found')
    error.status = 404
    throw error
  }
  return release
}

export const updateRelease = async (id, releaseData, filePath) => {
  const { title, genre_id, artist_id, release_date, description, release_type } = releaseData

  if (!title) {
    const error = new Error('title is required')
    error.status = 400
    throw error
  }

  const updateFields = {
    title,
    release_date,
    description,
    genre_id,
    release_type,
    bandcamp_link: releaseData.bandcamp_link,
    beatport_link: releaseData.beatport_link,
    spotify_link: releaseData.spotify_link,
    apple_music_link: releaseData.apple_music_link,
    youtube_link: releaseData.youtube_link,
    soundcloud_link: releaseData.soundcloud_link,
  }

  if (filePath) {
    updateFields.cover_image_url = filePath
  }

  // Solo se tocan si vienen en la petición. Un formulario que no manda estos
  // campos (cualquier form viejo del panel) no debe borrar el reproductor.
  if (releaseData.bandcamp_album_id !== undefined) {
    updateFields.bandcamp_album_id = releaseData.bandcamp_album_id || null
  }
  if (releaseData.bandcamp_track_count !== undefined) {
    updateFields.bandcamp_track_count = releaseData.bandcamp_track_count || null
  }

  const [affectedCount] = await Release.update(updateFields, { where: { id } })
  if (affectedCount === 0) {
    const error = new Error('Release not found')
    error.status = 404
    throw error
  }

  const artistIds = parseArtistIds(artist_id)
  const release = await Release.findByPk(id)
  if (release && artistIds.length > 0) {
    await release.setArtists(artistIds)
  }

  return Release.findOne({
    where: { id },
    include: [
      { model: Artist, as: 'artists', attributes: ['id', 'artist_name'] },
      { model: Genre, as: 'genre', attributes: ['id', 'name'] },
    ],
  })
}

export const deleteRelease = async (id) => {
  const release = await Release.findByPk(id)
  if (!release) {
    const error = new Error('Release not found')
    error.status = 404
    throw error
  }

  await ReleaseArtist.destroy({ where: { release_id: id } })
  await Release.destroy({ where: { id } })

  return { message: 'Release deleted successfully' }
}
