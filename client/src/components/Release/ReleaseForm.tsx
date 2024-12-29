import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Stack, TextField, MenuItem } from '@mui/material';
import FileUploadRelease from '../Upload/FileUploadRelease';
import Button from '@/components/Button/Button';
import { ReleaseFormProps } from '@/types/props/Form/ReleaseFormProps';


const ReleaseForm: React.FC<ReleaseFormProps> = ({
  handleSubmit,
  initialValues,
  validationSchema,
  artists,
  genres,
  handleClose,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit} // Corrected from handleSubmit to onSubmit
    >
      {({ isSubmitting, setFieldValue }) => (
        <Form>
          <Stack spacing={2} margin={2}>
            <Field name="title">
              {({ field, form }: any) => ( // Use a more specific type if possible
                <TextField
                  {...field}
                  label="Title"
                  variant="outlined"
                  error={Boolean(form.errors.title && form.touched.title)}
                  helperText={
                    form.errors.title && form.touched.title && form.errors.title
                  }
                />
              )}
            </Field>
            <Field name="release_date">
              {({ field, form }: any) => (
                <TextField
                  {...field}
                  variant="outlined"
                  type="date"
                  error={Boolean(form.errors.release_date && form.touched.release_date)}
                  helperText={
                    form.errors.release_date &&
                    form.touched.release_date &&
                    form.errors.release_date
                  }
                />
              )}
            </Field>
            <Field name="genre_id">
              {({ field, form }: any) => (
                <TextField
                  {...field}
                  select
                  label="Genre"
                  variant="outlined"
                  error={Boolean(form.errors.genre_id && form.touched.genre_id)}
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
            <Field name="artist_id">
              {({ field, form }: any) => (
                <TextField
                  {...field}
                  select
                  label="Artist"
                  variant="outlined"
                  error={Boolean(form.errors.artist_id && form.touched.artist_id)}
                  helperText={
                    form.errors.artist_id &&
                    form.touched.artist_id &&
                    form.errors.artist_id
                  }
                  onChange={(e) => {
                    const selectedIds = e.target.value;
                    setFieldValue('artist_id', selectedIds);
                  }}
                  SelectProps={{
                    multiple: true,
                    value: field.value || [],
                    onChange: (e) => {
                      const selectedIds = e.target.value;
                      setFieldValue('artist_id', selectedIds);
                    },
                    renderValue: (selected: number[]) => (
                      <div>
                        {selected.map((id) => (
                          <MenuItem key={id} value={id}>
                            {artists.find((artist) => artist.id === id)?.artist_name}
                          </MenuItem>
                        ))}
                      </div>
                    ),
                  }}
                >
                  {artists.map((artist) => (
                    <MenuItem key={artist.id} value={artist.id}>
                      {artist.artist_name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            </Field>

            <FileUploadRelease />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#24db13] text-[#122e0f]"
            >
              Submit
            </Button>
            <Button
              onClick={handleClose}
              className="bg-[#22581d] text-white"
            >
              Close
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

export default ReleaseForm;
