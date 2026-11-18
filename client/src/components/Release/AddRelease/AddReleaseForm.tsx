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
import ArtistCredits from '@/components/Release/ArtistCredits';

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
      setError(t('errors.addRelease'));
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
          // El verde fijo que había acá no está en la paleta del sello. Negro,
          // borde gris y esquinas rectas, igual que el resto de los modales.
          backgroundColor: 'rgb(var(--bg))',
          backgroundImage: 'none',
          border: '1px solid rgb(var(--muted) / 0.4)',
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          fontWeight: 800,
          fontSize: '1.125rem',
          borderBottom: '1px solid rgb(var(--muted) / 0.3)',
          paddingRight: '3.5rem',
        }}
      >
        {t('add_release')}
        <IconButton
          aria-label={t('cancel')}
          onClick={closePopup}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'rgb(var(--muted))',
            '&:hover': { color: 'rgb(var(--accent))', backgroundColor: 'transparent' },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            title: '',
            release_date: '',
            genre_id: '',
            release_type: '',
            artist_id: [] as number[],
            // Línea de crédito completa, incluidos los artistas sin ficha.
            artist_credit: '',
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
            // Sin mínimo de fichas: un lanzamiento puede ser de un invitado que
            // no está en la base. Lo obligatorio es el crédito, que incluye a
            // los dos tipos de artista.
            artist_id: Yup.array().of(Yup.number()),
            artist_credit: Yup.string().trim().required(t('validation.artistRequired')),
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
                <ArtistCredits
                  artists={artists}
                  artistIds={values.artist_id}
                  credit={values.artist_credit}
                  setFieldValue={setFieldValue}
                />
                <ErrorMessage name="artist_credit" component="div" className="error-message" />
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
