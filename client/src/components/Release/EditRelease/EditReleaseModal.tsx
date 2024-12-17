import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldProps, FormikProps } from 'formik';
import * as Yup from 'yup';
import Button from '@/components/Button/Button';
import FileUploadRelease from '@/components/Upload/FileUploadRelease';
import { useArtists } from '@/contexts/ArtistContext';
import { useGenres } from '@/contexts/GenreContext';
import { getReleaseRequest } from '@/app/api/releases';
import { useReleases } from '../../../contexts/ReleaseContext';
import { FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import Title from '@/components/atoms/Title/Title';
import { useTranslation } from 'react-i18next';
import { EditReleaseModalProps } from '@/types/props/Form/ReleaseFormProps';
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
  const navigate = useNavigate();
  const { t } = useTranslation();
  const release_id = id;

  const { updateRelease, deleteRelease } = useReleases();
  const { artists, fetchArtists } = useArtists();
  const { genres } = useGenres();

  const [initialValues, setInitialValues] = useState<Partial<Release>>(getInitialValues());

  useEffect(() => {
    fetchInitialData(release_id);
  }, [release_id]);

  const fetchInitialData = async (release_id: number) => {
    if (typeof release_id === 'number') {
      await fetchRelease(release_id);
      if (!artists.length) fetchArtists();
    } else {
      console.error('Invalid release_id:', release_id);
    }
  };

  const fetchRelease = async (release_id: number) => {
    try {
      const response = await getReleaseRequest(release_id);
      const data = mapReleaseData(response.data);
      setInitialValues(data);
    } catch (error) {
      console.error('Error fetching release:', error);
    }
  };

  const mapReleaseData = (data: any) => ({
    ...data,
    artist_id: data.artists?.[0]?.id || null,
    release_date: data.release_date?.split('T')[0] || '',
    genre: data.genre?.name || 'Unknown',
  });

  const handleSubmit = async (values: any, actions: any) => {
    const formData = createFormData(values);
    try {
      await updateRelease(Number(release_id), formData);
      onClose();
    } catch (error) {
      console.error('Error updating release:', error);
      actions.setSubmitting(false);
    }
  };

  const createFormData = (values: any) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (Array.isArray(values[key])) {
        values[key].forEach((value, index) => {
          formData.append(`${key}[${index}]`, value);
        });
      } else {
        formData.append(key, values[key]);
      }
    });
    return formData;
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
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="w-full shadow-md rounded px-8 pt-2 pb-2 mb-4 text-center">
            <Stack spacing={2} margin={2}>
              <Title className='text-3xl mb-4 text-center font-bold text-gray-300'>{t('edit_release')}</Title>
              <FieldInput label="Title:" id="title" name="title" />
              <ArtistSelect artists={artists} setFieldValue={setFieldValue} values={values} />
              <FileUploadRelease />
              <FieldInput label="Release Date:" id="release_date" name="release_date" type="date" />
              <FieldCheckbox label="Explicit Content:" id="is_explicit" name="is_explicit" />
              <FieldInput label="Description:" id="description" name="description" as="textarea" />
              <GenreSelect genres={genres} setFieldValue={setFieldValue} values={values} />
              <FieldSelect label="Release Type:" id="release_type" name="release_type" options={["Album", "Single", "EP"]} />
              <FieldInput label="Bandcamp Link:" id="bandcamp_link" name="bandcamp_link" />
              <FieldInput label="Beatport Link:" id="beatport_link" name="beatport_link" />
              <FieldInput label="Spotify Link:" id="spotify_link" name="spotify_link" />
              <FieldInput label="Apple Music Link:" id="apple_music_link" name="apple_music_link" />
              <FieldInput label="YouTube Link:" id="youtube_link" name="youtube_link" />
              <FieldInput label="SoundCloud Link:" id="soundcloud_link" name="soundcloud_link" />
              <ActionButtons isSubmitting={isSubmitting} onClose={onClose} onDelete={handleDelete} />
            </Stack>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const getInitialValues = () => ({
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

const FieldInput: React.FC<{ label: string; id: string; name: string; as?: any; type?: string }> = ({ label, id, name, as = 'input', type = 'text' }) => (
  <div className="mb-4 flex items-center justify-center">
    <label htmlFor={id} className="block text-gray-300 font-bold mb-2 w-1/5">{label}</label>
    <Field as={as} type={type} id={id} name={name} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
    <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
  </div>
);

const FieldCheckbox: React.FC<{ label: string; id: string; name: string }> = ({ label, id, name }) => (
  <div className="mb-4 flex items-center justify-center">
    <label htmlFor={id} className="block text-gray-300 font-bold mb-2 w-1/5">{label}</label>
    <Field type="checkbox" id={id} name={name} className="mr-2 leading-tight" />
  </div>
);

const ArtistSelect: React.FC<{ artists: Artist[]; setFieldValue: (field: string, value: any) => void; values: any }> = ({ artists, setFieldValue, values }) => (
  <div className="mb-4 flex items-center justify-center">
    <InputLabel htmlFor="artist_id" className="block text-gray-300 font-bold mb-2 w-1/5">Artist:</InputLabel>
    <FormControl fullWidth variant="outlined">
      <Field name="artist_id">
        {({ field, form }: FieldProps) => (
          <Select
            {...field}
            value={values.artist_id}
            onChange={(e) => setFieldValue('artist_id', e.target.value)}
            error={Boolean(form.errors.artist_id && form.touched.artist_id)}
          >
            {artists.map((artist: Artist) => (
              <MenuItem key={artist.id} value={artist.id}>{artist.artist_name}</MenuItem>
            ))}
          </Select>
        )}
      </Field>
      <ErrorMessage name="artist_id" component="div" className="text-red-500 text-sm mt-1" />
    </FormControl>
  </div>
);

const GenreSelect: React.FC<{ genres: any[]; setFieldValue: (field: string, value: any) => void; values: any }> = ({ genres, setFieldValue, values }) => (
  <div className="mb-4 flex items-center justify-center">
    <label htmlFor="genre_id" className="block text-gray-300 font-bold mb-2 w-1/5">Genre:</label>
    <Field name="genre_id">
      {({ field, form }: { field: FieldProps; form: FormikProps<any> }) => (
        <TextField
          {...field}
          select
          label="Genre"
          variant="outlined"
          error={!!form.errors.genre_id && form.touched.genre_id}
          helperText={form.errors.genre_id && form
