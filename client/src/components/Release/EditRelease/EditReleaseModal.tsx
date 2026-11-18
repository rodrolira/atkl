import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldProps, FormikProps } from 'formik';
import * as Yup from 'yup';
import { FormControl, InputLabel, MenuItem, Stack, TextField } from '@mui/material';
import Button from '@/components/Button/Button';
import ArtistCredits from '@/components/Release/ArtistCredits';
import FileUploadRelease from '@/components/Upload/FileUploadRelease';
import { useArtists } from '@/contexts/ArtistContext';
import { useGenres } from '@/contexts/GenreContext';
import { useReleases } from '@/contexts/ReleaseContext';
import Title from '@/components/atoms/Title/Title';
import { useTranslation } from 'react-i18next';
import { Release } from '@/types/interfaces/Release';
import { Artist } from '@/types/interfaces/Artist';
import { unirCreditos } from '@/utils/creditos';
import { mensajeDeError } from '@/utils/errores';

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
  // Línea de crédito completa, incluidos los artistas sin ficha en la base.
  artist_credit: '',
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

/**
 * Los mensajes salen de i18n porque el panel está en español y estaban
 * escritos en inglés a mano, igual que pasaba en editar artista.
 *
 * `artist_id` ya no exige un mínimo: la mayoría del catálogo son invitados sin
 * ficha en la base y exigir una ficha vinculada hacía imposible guardarlos. Lo
 * obligatorio es el crédito, que incluye a los dos tipos de artista.
 */
const buildValidationSchema = (t: (key: string) => string) =>
  Yup.object().shape({
    title: Yup.string().required(t('validation.titleRequired')),
    artist_id: Yup.array(),
    artist_credit: Yup.string().trim().required(t('validation.artistRequired')),
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
  const [errorServidor, setErrorServidor] = useState<string | null>(null);

  useEffect(() => {
    const release = releases.find((item) => item.id === id);
    if (release) {
      const vinculados = (release.artists || []) as Artist[];
      setInitialValues({
        ...emptyValues,
        title: release.title || '',
        artist_id: vinculados.map((artist) => artist.id).filter(Boolean) as number[],
        // Si el release tiene fichas vinculadas pero el crédito está vacío, se
        // arma con sus nombres: el crédito es la línea completa y de ahí sale
        // lo que se ve cuando una ficha se borra.
        artist_credit:
          release.artist_credit || unirCreditos(vinculados.map((artist) => artist.artist_name)),
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
    setErrorServidor(null);
    try {
      await updateRelease(id, values);
      onClose();
    } catch (error) {
      // Antes el fallo solo iba a consola: el modal quedaba abierto sin decir
      // nada y el botón se sentía muerto, igual que pasaba en editar artista.
      console.error('Error updating release:', error);
      setErrorServidor(mensajeDeError(error, t('errors.updateRelease')));
    }
  };

  const handleDelete = async () => {
    if (window.confirm(t('delete_release_confirmation', { title: initialValues.title }))) {
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
        validationSchema={buildValidationSchema(t)}
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

              <ArtistCredits
                artists={artists}
                artistIds={values.artist_id}
                credit={values.artist_credit}
                setFieldValue={setFieldValue}
              />
              <ErrorMessage name="artist_credit" component="div" className="error-message" />

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

              {errorServidor && (
                <div className="error-message" role="alert">{errorServidor}</div>
              )}

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  onClick={onClose}
                  className="btn"
                  variant="secondary"
                >
                  <p className="font-semibold">{t('cancel')}</p>
                </Button>
                <button
                  type="submit"
                  className="btn btn-save h-10 mt-2"
                  disabled={isSubmitting}
                >
                  <p className="font-semibold">{isSubmitting ? t('guardando') : t('save')}</p>
                </button>
                <Button
                  type="button"
                  variant="primary"
                  className="btn"
                  onClick={handleDelete}
                >
                  <p className="font-semibold">{t('delete')}</p>
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
