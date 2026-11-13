import api from './axios';

const RELEASE_FIELDS = [
  'title',
  'release_date',
  'description',
  'genre_id',
  'release_type',
  'bandcamp_link',
  // Sin esto, editar un release desde el panel admin no lo manda y el servidor
  // lo pone en null (updateRelease hace `|| null`), borrando el reproductor.
  'bandcamp_album_id',
  'beatport_link',
  'spotify_link',
  'apple_music_link',
  'youtube_link',
  'soundcloud_link',
];

const toFormData = (release) => {
  const formData = new FormData();

  RELEASE_FIELDS.forEach((field) => {
    const value = release[field];
    if (value !== undefined && value !== null && value !== '') {
      formData.append(field, value);
    }
  });

  const artistIds = release.artist_id
    ?? (release.artists || []).map((artist) => artist.id).filter(Boolean);

  artistIds.forEach((artistId) => formData.append('artist_id', artistId));

  if (release.cover_image_url instanceof File) {
    formData.append('cover_image_url', release.cover_image_url);
  }

  return formData;
};

// El API pagina de a 20 por defecto (máximo 100). Sin este límite el catálogo
// se cortaba en los primeros 20 lanzamientos sin que nada lo indicara.
export const getReleasesRequest = () => api.get('/releases', { params: { limit: 100 } });

export const getReleaseRequest = (id) => api.get(`/releases/${id}`);

export const createReleaseRequest = (release) => api.post('/releases', toFormData(release));

export const updateReleaseRequest = (id, release) =>
  api.put(`/releases/${id}`, toFormData(release));

export const deleteReleaseRequest = (id) => api.delete(`/releases/${id}`);
