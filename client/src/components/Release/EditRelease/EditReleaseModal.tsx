import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldProps, FormikProps } from 'formik';
import * as Yup from 'yup';
import { FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import Button from '@/components/Button/Button';
import FileUploadRelease from '@/components/Upload/FileUploadRelease';
import { useArtists } from '@/contexts/ArtistContext';
import { useGenres } from '@/contexts/GenreContext';
import { useReleases } from '@/contexts/ReleaseContext';
import Title from '@/components/atoms/Title/Title';
import { useTranslation } from 'react-i18next';
import { Release } from '@/types/interfaces/Release';
import { Artist } from '@/types/interfaces/Artist';

const SOCIAL_FIELDS = [
  'bandcamp_link',
  'beatport_link',
  'spotify_link',
  'apple_music_link',
  'youtube_link',
  'soundcloud_link',
];

const emptyValues = {
  title: '',
  artist_id: [] as number[],
  genre_id: '',
  release_date: '',
  description: '',
  release_type: '',
  cover_image_url: '' as string | File,
  bandcamp_link: '',
  beatport_link: '',
  spotify_link: '',
  apple_music_link: '',
  youtube_link: '',
  soundcloud_link: '',
};

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  artist_id: Yup.array().min(1, 'At least one artist is required'),
  cover_image_url: Yup.mixed(),
  release_date: Yup.date().nullable(),
  description: Yup.string(),
  genre_id: Yup.string(),
  release_type: Yup.string(),
});

const EditReleaseModal: React.FC<{ id: number; onClose: () => void }> = ({ id, onClose }) => {
  const { t } = useTranslation();
  const { releases, updateRelease, deleteRelease } = useReleases();
  const { artists, fetchArtists } = useArtists();
  const { genres } = useGenres();
  const [initialValues, setInitialValues] = useState(emptyValues);

  useEffect(() => {
    const release = releases.find((item) => item.id === id);
    if (release) {
      setInitialValues({
        ...emptyValues,
        title: release.title || '',
        artist_id: (release.artists || []).map((artist: Artist) => artist.id).filter(Boolean) as number[],
        genre_id: release.genre_id ? String(release.genre_id) : '',
        release_date: release.release_date ? String(release.release_date).slice(0, 10) : '',
        description: release.description || '',
        release_type: release.release_type || '',
        cover_image_url: release.imageUrl || release.cover_image_url || '',
        ...SOCIAL_FIELDS.reduce(
          (links, field) => ({ ...links, [field]: release[field] || '' }),
          {} as Record<string, string>
        ),
      });
    }
  }, [id, releases]);

  useEffect(() => {
    if (!artists.length) {
      fetchArtists();
    }
  }, [artists.length, fetchArtists]);

  const onSubmit = async (values: typeof emptyValues) => {
    try {
      await updateRelease(id, values);
      onClose();
    } catch (error) {
      console.error('Error updating release:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this release?')) {
      try {
        await deleteRelease(id);
        onClose();
      } catch (error) {
        console.error('Error deleting release:', error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, isSubmitting, values }: FormikProps<typeof emptyValues>) => (
          <Form className="w-full shadow-md rounded px-8 pt-2 pb-2 mb-4 text-center">
            <Stack spacing={2} margin={2}>
              <Title className='!text-3xl mb-4 text-center font-bold text-gray-300'>{t('edit_release')}</Title>
              <Field
                type="text"
                name="title"
                as={TextField}
                label="Title"
                variant="outlined"
                fullWidth
              />
              <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />

              <div className="mb-4 flex items-center justify-center">
                <InputLabel
                  htmlFor="artist_id"
                  className="block !text-gray-300 !font-bold mb-2 w-1/5"
                >Artist:</InputLabel>
                <FormControl fullWidth variant="outlined">
                  <Field name="artist_id">
                    {({ field }: FieldProps) => (
                      <TextField
                        {...field}
                        select
                        id="artist_id"
                        value={values.artist_id}
                        variant="outlined"
                        size="small"
                        fullWidth
                        InputProps={{ className: '!text-gray-700 !text-start' }}
                        SelectProps={{
                          multiple: true,
                          onChange: (event) => setFieldValue('artist_id', event.target.value),
                        }}
                      >
                        {artists.map((artist: Artist) => (
                          <MenuItem key={artist.id} value={artist.id}>
                            {artist.artist_name}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  </Field>
                </FormControl>
              </div>
              <ErrorMessage name="artist_id" component="div" className="text-red-500 text-sm mt-1" />

              <FormControl fullWidth variant="outlined">
                <InputLabel>Genre</InputLabel>
                <Field name="genre_id">
                  {({ field }: FieldProps) => (
                    <TextField
                      {...field}
                      select
                      label="Genre"
                      variant="outlined"
                      fullWidth
                      onChange={(event) => setFieldValue('genre_id', event.target.value)}
                    >
                      {genres.map((genre) => (
                        <MenuItem key={genre.id} value={String(genre.id)}>
                          {genre.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Field>
              </FormControl>

              <Field type="date" name="release_date" as={TextField} label="Release Date" variant="outlined" fullWidth />
              <ErrorMessage name="release_date" component="div" className="text-red-500 text-sm mt-1" />

              <FileUploadRelease />

              <Field name="release_type">
                {({ field }: FieldProps) => (
                  <TextField {...field} select variant="outlined" fullWidth label="Release Type">
                    <MenuItem value="Album">Album</MenuItem>
                    <MenuItem value="Single">Single</MenuItem>
                    <MenuItem value="EP">EP</MenuItem>
                    <MenuItem value="Compilation">Compilation</MenuItem>
                    <MenuItem value="V.A">V.A</MenuItem>
                  </TextField>
                )}
              </Field>

              <Field name="description" as={TextField} label="Description" variant="outlined" fullWidth multiline rows={3} />

              {SOCIAL_FIELDS.map((link) => (
                <Field key={link} name={link}>
                  {({ field }: FieldProps) => (
                    <TextField
                      {...field}
                      label={link.replace('_link', '').toUpperCase()}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                </Field>
              ))}

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  onClick={onClose}
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
};

export default EditReleaseModal;
