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
import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { useReleases } from '@/contexts/ReleaseContext';
import { useArtists } from '@/contexts/ArtistContext';
import { useGenres } from '@/contexts/GenreContext';
import FileUploadRelease from '@/components/Upload/FileUploadRelease';
import { useTranslation } from 'react-i18next';
import CustomTextInput from '@/components/atoms/Input/CustomTextInput';
import Button from '@/components/Button/Button';

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
  const [customArtists, setCustomArtists] = useState<string[]>([]);

  useEffect(() => {
    fetchArtists();
    fetchGenres();
  }, [fetchArtists, fetchGenres]);

  const handleAddCustomArtist = () => {
    setCustomArtists((prev) => [...prev, '']);
  };

  const handleCustomArtistChange = (index: number, value: string) => {
    setCustomArtists((prev) => {
      const updatedArtists = [...prev];
      updatedArtists[index] = value;
      return updatedArtists;
    });
  };

  const onSubmit = async (values: any, actions: any) => {
    // Combina artistas seleccionados y personalizados
    const allArtists = [...values.artist_id, ...customArtists.filter(Boolean)];

    // Crear un nuevo release localmente
    const newRelease = {
      ...values,
      artist_id: allArtists,
      id: Date.now(), // Generar ID único
    };

    createRelease(newRelease); // Llama al método del contexto para guardar el release
    actions.resetForm();
    closePopup();
    if (onReleaseAdded) {
      onReleaseAdded(newRelease);
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
            genre_id: Yup.string().required('Genre is required'),
            release_type: Yup.string().required('Release type is required'),
            artist_id: Yup.array().of(Yup.string()),
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
                {customArtists.map((artist, index) => (
                  <CustomTextInput
                    key={index}
                    label={`Custom Artist ${index + 1}`}
                    value={artist}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCustomArtistChange(index, e.target.value)} name={''}                  />
                ))}
                <Button onClick={handleAddCustomArtist}>Add Custom Artist</Button>
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
          className="mx-auto btn btn-save h-10 mt-2 font-bold flex justify-center !bg-[#24db13] text-[#122e0f]"
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
