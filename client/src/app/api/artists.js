import api from './axios';

const ARTIST_FIELDS = [
  'artist_name',
  'email',
  'username',
  'password',
  'bio',
  'bandcamp_link',
  'facebook_link',
  'instagram_link',
  'soundcloud_link',
  'twitter_link',
  'youtube_link',
  'spotify_link',
  'apple_music_link',
  'beatport_link',
];

const toFormData = (artist) => {
  const formData = new FormData();

  ARTIST_FIELDS.forEach((field) => {
    const value = artist[field];
    if (value !== undefined && value !== null && value !== '') {
      formData.append(field, value);
    }
  });

  if (Array.isArray(artist.roleIds)) {
    formData.append('roleIds', artist.roleIds.join(','));
  } else if (artist.roleIds !== undefined && artist.roleIds !== null) {
    formData.append('roleIds', artist.roleIds);
  }

  if (artist.image instanceof File) {
    formData.append('image', artist.image);
  }

  return formData;
};

export const getArtistsRequest = () => api.get('/artists');

export const getArtistRequest = (id) => api.get(`/artists/${id}`);

export const createArtistRequest = (artist) => api.post('/artists', toFormData(artist));

export const updateArtistRequest = (id, artist) =>
  api.put(`/artists/${id}`, toFormData(artist));

export const deleteArtistRequest = (id) => api.delete(`/artists/${id}`);
