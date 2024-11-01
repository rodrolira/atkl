import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldProps, FormikProps } from 'formik';
import * as Yup from 'yup';
import Button from '@/components/Button/Button';
import FileUploadRelease from '@/components/Upload/FileUploadRelease';
import { useArtists } from '@/contexts/ArtistContext';
import { useGenres } from '@/contexts/GenreContext';
import { getReleaseRequest } from '@/app/api/releases';
import { useReleases } from '../../../contexts/ReleaseContext'
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import Title from '@/components/atoms/Title/Title';
import { useTranslation } from 'react-i18next';
import { EditReleaseModalProps } from '@/types/props/Form/ReleaseFormProps';
import { FormValues, ReleaseFormValues } from '@/types/interfaces/Form';
import { Release } from '@/types/interfaces/Release';
import { Artist } from '../../../types/interfaces/Artist';

const validationSchema = Yup.object().shape({
  title: Yup.string(),
  artist_id: Yup.string(),
  cover_image_url: Yup.mixed(),
  release_date: Yup.date(),
  description: Yup.string(),
  genre_id: Yup.string(),
  release_type: Yup.string(),
});

const EditReleaseModal: React.FC<EditReleaseModalProps> = ({ id, onClose }) => {
  const release_id = id;
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState<Partial<Release>>({
    title: '',
    artist_id: '',
    is_explicit: false,
    cover_image_url: '',
    release_date: '',
    description: '',
    genre_id: '',
    release_type: '',
    bandcamp_link: '',
    spotify_link: '',
    apple_music_link: '',
    youtube_link: '',
    soundcloud_link: '',
    beatport_link: '',
  });

  const { updateRelease, deleteRelease } = useReleases();
  const { artists, fetchArtists } = useArtists();
  const { genres } = useGenres();

  useEffect(() => {
    if (typeof release_id === 'number') {
      fetchRelease(release_id);
    } else {
      console.error('Invalid release_id:', release_id);
    }
    if (!artists.length) fetchArtists();
  }, [release_id]);

  const fetchRelease = async (release_id: number) => {
    try {
      const response = await getReleaseRequest(release_id);

      const artists = response.data.artists || [];
      const releaseData = {
        ...response.data,
        genre: response.data.genre?.name || 'Unknown', // Maneja caso en que `genre` pueda ser undefined
        artists: artists.map((artist: Artist) => artist.artist_name), // Mapea solo si hay artistas
        artist_id: artists.length > 0 ? artists[0].id : null, // Solo asigna `artist_id` si hay al menos un artista
        release_date: response.data.release_date ? response.data.release_date.split('T')[0] : '',
      };
      setInitialValues(releaseData);
    } catch (error) {
      console.error('Error fetching release:', error);
    }
  };

  const onSubmit = async (values: any, actions: any) => {
    const formData = new FormData();

    Object.keys(values).forEach((key) => {
      if (Array.isArray(values[key])) { // Handle arrays
        values[key].forEach((value, index) => {
          formData.append(`${key}[${index}]`, value);
        });
      } else if (values[key] instanceof File) {
        formData.append(key, values[key]);
      } else {
        formData.append(key, values[key]);
      }
    });

    console.log([...formData]);

    try {
      await updateRelease(Number(release_id), formData);
      onClose();
    } catch (error) {
      console.error('Error updating release:', error);
      actions.setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this release?')) {
      try {
        await deleteRelease(Number(release_id));
        navigate('/releases');
      } catch (error) {
        console.error('Error deleting release:', error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Formik
        initialValues={initialValues as Release & Partial<Release>}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="w-full bg-white shadow-md rounded px-8 pt-2 pb-2 mb-4 text-center">
            <Stack spacing={2} margin={2}>
              <Title className='!text-3xl mb-4 text-center font-bold text-gray-700'>{t('edit_release')}</Title>
              <div className="mb-4 flex items-center justify-center">
                <label
                  htmlFor="title"
                  className="block !text-gray-700 font-bold mb-2 w-1/5"
                >
                  Title:
                </label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Title"
                  autoComplete="off"
                  autoFocus
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="mb-4 flex items-center justify-center">
                <InputLabel
                  htmlFor="artist_id"
                  className="block !text-gray-700 !font-bold mb-2 w-1/5"
                >Artist:</InputLabel>
                <FormControl fullWidth variant="outlined">
                  <Field
                    name="artist_id"
                    className="shadow appearance-none !border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    {({ field, form }: FieldProps) => (
                      <Select
                        {...field}
                        label="Artist"
                        value={values.artist_id}
                        className="shadow appearance-none border rounded w-full  text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        size="small"
                        fullWidth
                        color='purple'
                        inputProps={{ className: '!text-gray-700 !text-start' }}
                        onChange={(e) => setFieldValue('artist_id', e.target.value)}
                        error={Boolean(form.errors.artist_id && form.touched.artist_id)}
                      >
                        {artists.map((artist: Artist) => (
                          <MenuItem key={artist.id} value={artist.id}>
                            {artist.artist_name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </Field>
                </FormControl>

              </div>
              <div className="mb-4 flex items-center justify-center">
                <FileUploadRelease />
              </div>
              <div className="mb-4 flex items-center justify-center">
                <label
                  htmlFor="release_date"
                  className="block text-gray-700 font-bold mb-2  w-1/5"
                >
                  Release Date:
                </label>
                <Field
                  type="date"
                  id="release_date"
                  name="release_date"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
                />
                <ErrorMessage
                  name="release_date"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4 flex items-center justify-center">
                <label
                  htmlFor="is_explicit"
                  className="block text-gray-700 font-bold mb-2 w-1/5"
                >
                  Explicit Content:
                </label>
                <Field
                  type="checkbox"
                  id="is_explicit"
                  name="is_explicit"
                  className="mr-2 leading-tight"
                />
              </div>
              <div className="mb-4 flex items-center justify-center">
                <label
                  htmlFor="description"
                  className="block text-gray-700 font-bold mb-4 w-1/5"
                >
                  Description:
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Description"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4 flex items-center justify-center">
                <label
                  htmlFor="genres"
                  className="block text-gray-700 font-bold mb-2 w-1/5"
                >
                  Genre:
                </label>
                <Field
                  name="genre_id"
                  className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  {({ field, form }: { field: FieldProps; form: FormikProps<ReleaseFormValues> }) => (
                    <TextField
                      {...field}
                      select
                      label="Genre"
                      variant="outlined"
                      className="w-full shadow appearance-none border rounded py-2 px-3 !text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      size="small"
                      margin="normal"
                      fullWidth
                      SelectProps={{
                        color: 'purple',
                        classes: {
                          select: '!text-gray-700 !text-start',
                        },
                      }}
                      error={!!form.errors.genre_id && form.touched.genre_id}
                      helperText={
                        form.errors.genre_id &&
                        form.touched.genre_id &&
                        form.errors.genre_id
                      }
                      onChange={(e) => setFieldValue('genre_id', e.target.value)}
                    >
                      {genres.map((genre) => (
                        <MenuItem key={genre.id} value={genre.id}>
                          {genre.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Field>
                <ErrorMessage
                  name="genre_id"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />

              </div>
              <div className="mb-4 flex items-center justify-center">
                <label
                  htmlFor="release_type"
                  className="block !text-gray-700 font-bold mb-2 w-1/5"
                >
                  Release Type:
                </label>
                <Field name="release_type" type="select" id="release_type" className="w-full">
                  {({ field, form }: { field: FieldProps; form: FormikProps<ReleaseFormValues> }) => (

                    <Select
                      {...field}
                      label="Release Type"
                      variant="outlined"
                      color="purple"
                      labelId='release_type'
                      id="release_type"
                      className="w-full shadow appearance-none border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      error={
                        !!form.errors.release_type && form.touched.release_type
                      }
                      classes={{
                        select: '!text-gray-700 !text-start',
                      }}

                    >
                      <MenuItem value="Album">Album</MenuItem>
                      <MenuItem value="Single">Single</MenuItem>
                      <MenuItem value="EP">EP</MenuItem>
                    </Select>
                  )}
                </Field>
              </div>
              <div className="mb-4 flex items-center justify-center">
                <label
                  htmlFor="bandcamp_link"
                  className="block text-gray-700 font-bold mb-2 w-1/5"
                >
                  Bandcamp Link:
                </label>
                <Field
                  type="text"
                  id="bandcamp_link"
                  name="bandcamp_link"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Bandcamp Link"
                />
                <ErrorMessage
                  name="bandcamp_link"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4 flex items-center justify-center">
                <label
                  htmlFor="beatport_link"
                  className="block text-gray-700 font-bold mb-2 w-1/5"
                >
                  Beatport Link:
                </label>
                <Field
                  type="text"
                  id="beatport_link"
                  name="beatport_link"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Beatport Link"
                />
                <ErrorMessage
                  name="beatport_link"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4 flex items-center justify-center">
                <label
                  htmlFor="spotify_link"
                  className="block text-gray-700 font-bold mb-2 w-1/5"
                >
                  Spotify Link:
                </label>
                <Field
                  type="text"
                  id="spotify_link"
                  name="spotify_link"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Spotify Link"
                />
                <ErrorMessage
                  name="spotify_link"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4 flex items-center justify-center">
                <label
                  htmlFor="apple_music_link"
                  className="block text-gray-700 font-bold mb-2 w-1/5"
                >
                  Apple Music Link:
                </label>
                <Field
                  type="text"
                  id="apple_music_link"
                  name="apple_music_link"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Apple Music Link"
                />
                <ErrorMessage
                  name="apple_music_link"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4 flex items-center justify-center">
                <label
                  htmlFor="youtube_link"
                  className="block text-gray-700 font-bold mb-2 w-1/5"
                >
                  YouTube Link:
                </label>
                <Field
                  type="text"
                  id="youtube_link"
                  name="youtube_link"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="YouTube Link"
                />
                <ErrorMessage
                  name="youtube_link"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4 flex items-center justify-center">
                <label
                  htmlFor="soundcloud_link"
                  className="block text-gray-700 font-bold mb-2 w-1/5"
                >
                  SoundCloud Link:
                </label>
                <Field
                  type="text"
                  id="soundcloud_link"
                  name="soundcloud_link"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="SoundCloud Link"
                />
                <ErrorMessage
                  name="soundcloud_link"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  onClick={onClose} // Cambia a navigate para cerrar el modal
                  className="btn"
                  colorClass="bg-gray-500 hover:bg-gray-600 text-white "
                >
                  <p className="font-semibold">Cancel</p>
                </Button>
                <button
                  type="submit"
                  className="btn btn-save h-10 mt-2"
                  disabled={isSubmitting}
                >
                  <p className="font-semibold">Save</p>
                </button>
                <Button
                  type="button"
                  colorClass="bg-red-500 hover:bg-red-600 text-white"
                  className="btn"
                  onClick={handleDelete}
                >
                  <p className="font-semibold">Delete</p>
                </Button>
              </div>
            </Stack>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default EditReleaseModal;
