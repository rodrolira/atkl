import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form, Field, FieldProps, useField } from 'formik';
import * as Yup from 'yup';
import { useReleases } from '@/contexts/ReleaseContext';
import { useArtists } from '@/contexts/ArtistContext';
import { useGenres } from '@/contexts/GenreContext';
import FileUploadRelease from '@/components/Upload/FileUploadRelease';
import { createReleaseRequest } from '@/app/api/releases';
import { useTranslation } from 'react-i18next';
import { Artist } from '../../../types/interfaces/Artist';
import CustomTextInput from '@/components/atoms/Input/CustomTextInput';
import Button from '@/components/Button/Button';

interface AddReleaseFormProps {
  open: boolean;
  closePopup: () => void;
  onReleaseAdded?: (newRelease: any) => void; // Define more specific type if possible
}

const artists: Artist[] = [];

const AddReleaseForm: React.FC<AddReleaseFormProps> = ({
  open,
  closePopup,
  onReleaseAdded,
}) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const { createRelease, fetchReleases } = useReleases();
  const { artists, fetchArtists } = useArtists();
  const { genres, fetchGenres } = useGenres();
  const [customArtists, setCustomArtists] = useState<string[]>([]);

  const handleAddCustomArtist = useCallback(() => {
    setCustomArtists((prev) => [...prev, '']);
  }, []);

  const handleCustomArtistChange = useCallback((index: number, value: string) => {
    setCustomArtists((prev) => {
      const updatedArtists = [...prev];
      updatedArtists[index] = value;
      return updatedArtists;
    });
  }, []);

  const paperProps = useMemo(() => ({
    sx: {
      borderRadius: '0px',
      margin: '0',
      display: 'inline-flex',
      flexDirection: 'column',
      position: 'relative',
      float: 'right',
      zIndex: '10',
      backgroundColor: 'rgba(18, 46, 15, 0.9)',
      backgroundImage: 'none',
    },
  }), []);

  const onSubmit = async (values: any, actions: any) => {
    const formData = new FormData();
    // Concatenamos los artistas seleccionados de la base de datos y los personalizados
    const allArtists = [...values.artist_id, ...customArtists.filter(Boolean)];
    formData.append('artist_id', JSON.stringify(allArtists));

    Object.keys(values).forEach((key) => {
      if (Array.isArray(values[key])) {
        values[key].forEach((value, index) => {
          formData.append(`${key}[${index}]`, value);
        });
      } else if (values[key] instanceof File) {
        formData.append(key, values[key]);
      } else {
        formData.append(key, values[key]);
      }
    });

    try {
      const newRelease = await createReleaseRequest(formData);
      actions.resetForm(false);
      closePopup();
      await fetchReleases();
      onReleaseAdded && onReleaseAdded(newRelease);
    } catch (error) {
      console.error('Error adding release:', error);
      setError('Failed to add release');
      actions.setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchArtists();
    fetchGenres();
  }, [fetchArtists, fetchGenres]);

  return (
    <Dialog
      open={open}
      onClose={closePopup}
      fullWidth
      maxWidth="sm"
      PaperProps={paperProps}
      scroll="body"
    >
      <DialogTitle style={{ textAlign: 'center' }} sx={{ bgcolor: 'rgba(18, 46, 15, 1.8)', height: '10vh' }}>
        {t('Add Release')}
        <IconButton style={{ float: 'right' }} onClick={closePopup}>
          <CloseIcon color="error" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            title: '',
            release_date: '',
            genre_id: '',
            release_type: '',
            artist_id: [] as string[],
            bandcamp_link: '',
            beatport_link: '',
            spotify_link: '',
            apple_music_link: '',
            youtube_link: '',
            soundcloud_link: '',
            cover_image_url: '',
            description: '',
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string().required('Title is required'),
            release_date: Yup.date().required('Release date is required'),
            genre_id: Yup.string().required('Genre is required'),
            release_type: Yup.string().required('Release type is required'),
            artist_id: Yup.array()
              .of(Yup.string()),
            bandcamp_link: Yup.string(),
            beatport_link: Yup.string(),
            spotify_link: Yup.string(),
            apple_music_link: Yup.string(),
            youtube_link: Yup.string(),
            soundcloud_link: Yup.string(),
            cover_image_url: Yup.mixed(),
            description: Yup.string(),
          })}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <Stack spacing={2} margin={2}>
                <Field name="title" type="text" autoComplete="on" >
                  {({ field, form }: FieldProps) => (
                    <CustomTextInput
                      {...field}
                      label="Title"
                      variant="outlined"
                      autoComplete="on"
                      error={Boolean(form.errors.title && form.touched.title)}
                      helperText={
                        form.errors.title &&
                        form.touched.title &&
                        String(form.errors.title)
                      }
                    />
                  )}
                </Field>
                <Field name="release_date">
                  {({ field, form }: FieldProps) => (
                    <CustomTextInput
                      {...field}
                      variant="outlined"
                      type="date"
                      error={Boolean(
                        form.errors.release_date && form.touched.release_date
                      )}
                      helperText={
                        form.errors.release_date &&
                          form.touched.release_date
                          ? String(form.errors.release_date)
                          : ''
                      }
                    />
                  )}
                </Field>
                <FormControl fullWidth variant="outlined">
                  <InputLabel className='text-white'>Genre</InputLabel>
                  <Field name="genre_id">
                    {({ field, form }: FieldProps) => (
                      <Select
                        {...field}
                        label="Genre"
                        onChange={(e) => setFieldValue('genre_id', e.target.value)}
                        value={values.genre_id}
                        error={Boolean(form.errors.genre_id && form.touched.genre_id)}
                      >
                        {genres.map((genre) => (
                          <MenuItem key={genre.id} value={genre.id}>
                            {genre.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </Field>
                </FormControl>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Artist</InputLabel>
                  <Field name="artist_id">
                    {({ field, form }: FieldProps) => (
                      <Select
                        {...field}
                        multiple
                        label="Artist"
                        value={values.artist_id}
                        onChange={(e) => setFieldValue('artist_id', e.target.value)}
                        renderValue={(selected) => (
                          <div>
                            {selected.map((id) => (
                              <div key={id}>
                                {
                                  artists.find((artist: any) => artist.id === id)
                                    ?.artist_name
                                }
                              </div>
                            ))}
                          </div>
                        )}
                        error={Boolean(
                          form.errors.artist_id && form.touched.artist_id,
                        )}
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
                 {/* Custom Artists Section */}
                 {customArtists.map((artist, index) => (
                  <TextField
                    key={index}
                    label={`Custom Artist ${index + 1}`}
                    value={artist}
                    onChange={(e) => handleCustomArtistChange(index, e.target.value)}
                  />
                ))}
                <Button onClick={handleAddCustomArtist}>Add Custom Artist</Button>
                <FileUploadRelease />
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Release Type</InputLabel>
                  <Field name="release_type">
                    {({ field, form }: FieldProps) => (
                      <Select
                        {...field}
                        label="Release Type"
                        variant="outlined"
                        onChange={(e) => setFieldValue('release_type', e.target.value)}
                        value={values.release_type}
                        error={Boolean(
                          form.errors.release_type && form.touched.release_type)}
                      >
                        <MenuItem value="Album">Album</MenuItem>
                        <MenuItem value="Single">Single</MenuItem>
                        <MenuItem value="EP">EP</MenuItem>
                      </Select>
                    )}
                  </Field>
                </FormControl>
                <Field name="description">
                  {({ field }: FieldProps) => (
                    <CustomTextInput
                      {...field}
                      label="Description"
                      variant="outlined"
                      color='success'
                      multiline
                      rows={4}
                    />
                  )}
                </Field>
                <Field name="bandcamp_link">
                  {({ field }: FieldProps) => (
                    <CustomTextInput
                      {...field}
                      label="Bandcamp Link"
                      variant="outlined"
                    />
                  )}
                </Field>
                <Field name="beatport_link">
                  {({ field }: FieldProps) => (
                    <CustomTextInput
                      {...field}
                      label="Beatport Link"
                      variant="outlined"
                    />
                  )}
                </Field>
                <Field name="spotify_link">
                  {({ field }: FieldProps) => (
                    <CustomTextInput
                      {...field}
                      label="Spotify Link"
                      variant="outlined"
                    />
                  )}
                </Field>
                <Field name="apple_music_link">
                  {({ field }: FieldProps) => (
                    <CustomTextInput
                      {...field}
                      label="Apple Music Link"
                      variant="outlined"
                    />
                  )}
                </Field>
                <Field name="youtube_link">
                  {({ field }: FieldProps) => (
                    <CustomTextInput
                      {...field}
                      label="Youtube Link"
                      variant="outlined"
                    />
                  )}
                </Field>
                <Field name="soundcloud_link">
                  {({ field }: FieldProps) => (
                    <CustomTextInput
                      {...field}
                      label="Soundcloud Link"
                      variant="outlined"
                    />
                  )}
                </Field>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mx-auto btn btn-save h-10 mt-2 font-bold flex justify-center !bg-[#24db13] text-[#122e0f]"
                >
                  {isSubmitting ? 'Adding...' : 'Add'}
                </button>
                {error && <div style={{ color: 'red' }}>{error}</div>}
              </Stack>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddReleaseForm;
