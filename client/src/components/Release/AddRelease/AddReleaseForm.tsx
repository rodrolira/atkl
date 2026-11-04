import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form, Field, FieldProps, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useReleases } from '@/contexts/ReleaseContext';
import { useArtists } from '@/contexts/ArtistContext';
import { useGenres } from '@/contexts/GenreContext';
import FileUploadRelease from '@/components/Upload/FileUploadRelease';
import { useTranslation } from 'react-i18next';
import CustomTextInput from '@/components/atoms/Input/CustomTextInput';

interface AddReleaseFormProps {
  open: boolean;
  closePopup: () => void;
  onReleaseAdded?: (newRelease: any) => void; // Define more specific type if possible
}

const AddReleaseForm: React.FC<AddReleaseFormProps> = ({
  open,
  closePopup,
  onReleaseAdded,
}) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const { createRelease } = useReleases(); // Contexto de releases
  const { artists, fetchArtists } = useArtists();
  const { genres, fetchGenres } = useGenres();

  useEffect(() => {
    fetchArtists();
    fetchGenres();
  }, [fetchArtists, fetchGenres]);

  const onSubmit = async (values: any, actions: any) => {
    try {
      await createRelease(values);
      actions.resetForm();
      closePopup();
      if (onReleaseAdded) {
        onReleaseAdded(values);
      }
    } catch (err) {
      console.error('Error creating release:', err);
      setError(t('error.addRelease'));
    } finally {
      actions.setSubmitting(false);
    }
  };


  return (
    <Dialog
      open={open}
      onClose={closePopup}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 0,
          margin: 0,
          display: 'inline-flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 10,
          backgroundColor: 'rgba(18, 46, 15, 0.9)',
        },
      }}
    >
      <DialogTitle sx={{ bgcolor: 'rgba(18, 46, 15, 1)', height: '10vh', textAlign: 'center' }}>
        {t('Add Release')}
        <IconButton sx={{ float: 'right' }} onClick={closePopup}>
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
            genre_id: Yup.number().required('Genre is required'),
            release_type: Yup.string().required('Release type is required'),
            artist_id: Yup.array().min(1, 'At least one artist is required').of(Yup.number()),
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
                <Field name="title" type="text" autoComplete="on">
                  {({ field, form }: FieldProps) => (
                    <CustomTextInput
                      {...field}
                      label="Title"
                      variant="outlined"
                      error={Boolean(form.errors.title && form.touched.title)}
                      helperText={form.errors.title && form.touched.title ? String(form.errors.title) : ''}
                    />
                  )}
                </Field>
                <Field name="release_date">
                  {({ field, form }: FieldProps) => (
                    <CustomTextInput
                      {...field}
                      variant="outlined"
                      type="date"
                      error={Boolean(form.errors.release_date && form.touched.release_date)}
                      helperText={form.errors.release_date && form.touched.release_date ? String(form.errors.release_date) : ''}
                    />
                  )}
                </Field>
                <FormControl fullWidth variant="outlined">
                  <InputLabel className="text-white">Genre</InputLabel>
                  <Field name="genre_id">
                    {({ field }: FieldProps) => (
                      <Select
                        {...field}
                        label="Genre"
                        onChange={(e) => setFieldValue('genre_id', e.target.value)}
                        value={values.genre_id}
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
                <ErrorMessage name="genre_id" component="div" className="text-red-500 text-sm" />
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Artist</InputLabel>
                  <Field name="artist_id">
                    {({ field }: FieldProps) => (
                      <Select
                        {...field}
                        multiple
                        label="Artist"
                        value={values.artist_id}
                        onChange={(e) => setFieldValue('artist_id', e.target.value)}
                      >
                        {artists.map((artist) => (
                          <MenuItem key={artist.id} value={artist.id}>
                            {artist.artist_name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </Field>
                </FormControl>
                <ErrorMessage name="artist_id" component="div" className="text-red-500 text-sm" />
                <FileUploadRelease />
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Release Type</InputLabel>
                  <Field name="release_type">
                    {({ field }: FieldProps) => (
                      <Select
                        {...field}
                        label="Release Type"
                        onChange={(e) => setFieldValue('release_type', e.target.value)}
                        value = { values.release_type }
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
              multiline
              rows={4}
            />
          )}
        </Field>
        {['bandcamp_link', 'beatport_link', 'spotify_link', 'apple_music_link', 'youtube_link', 'soundcloud_link'].map((link) => (
          <Field key={link} name={link}>
            {({ field }: FieldProps) => (
              <CustomTextInput
                {...field}
                label={link.replace('_', ' ').replace('link', ' Link').toUpperCase()}
                variant="outlined"
              />
            )}
          </Field>
        ))}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mx-auto btn btn-save h-10 mt-2 font-bold flex justify-center bg-metallic-gray text-black hover:bg-white"
        >
          {isSubmitting ? 'Adding...' : 'Add'}
        </button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </Stack>
    </Form>
  )
}
        </Formik >
      </DialogContent >
    </Dialog >
  );
};

export default AddReleaseForm;
