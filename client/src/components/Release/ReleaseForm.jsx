// ReleaseForm.jsx
import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Stack, TextField, MenuItem } from '@mui/material';
import FileUploadRelease from '../../molecules/FileUploadRelease';
import Button from '@/components/Button/Button';
// import { Button } from 'react-bootstrap';

const ReleaseForm = ({ handleSubmit, initialValues, validationSchema, artists, genres, handleClose }) => {
    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} handleSubmit={handleSubmit}>
            {({ isSubmitting, setFieldValue }) => (
                <Form>
                    <Stack spacing={2} margin={2}>
                        <Field name="title">
                            {({ field, form }) => (
                                <TextField
                                    {...field}
                                    label="Title"
                                    variant="outlined"
                                    error={form.errors.title && form.touched.title}
                                    helperText={form.errors.title && form.touched.title && form.errors.title}
                                />
                            )}
                        </Field>
                        <Field name="release_date">
                            {({ field, form }) => (
                                <TextField
                                    {...field}
                                    variant="outlined"
                                    type="date"
                                    error={form.errors.release_date && form.touched.release_date}
                                    helperText={form.errors.release_date && form.touched.release_date && form.errors.release_date}
                                />
                            )}
                        </Field>
                        <Field name="genre_id">
                            {({ field, form }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Genre"
                                    variant="outlined"
                                    error={form.errors.genre_id && form.touched.genre_id}
                                    helperText={form.errors.genre_id && form.touched.genre_id && form.errors.genre_id}
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
                            {({ field, form }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Artist"
                                    variant="outlined"
                                    error={Boolean(form.errors.artist_id && form.touched.artist_id)}
                                    helperText={form.errors.artist_id && form.touched.artist_id && form.errors.artist_id}
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
                                        renderValue: (selected) => (
                                            <div>
                                                {selected.map(id => (
                                                    <MenuItem key={id} value={id}>
                                                        {artists.find(artist => artist.id === id)?.artist_name}
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
                        <Field name="bandcamp_link">
                            {({ field }) => (
                                <TextField {...field} label="Bandcamp Link" variant="outlined" />
                            )}
                        </Field>
                        <Field name="beatport_link">
                            {({ field }) => (
                                <TextField {...field} label="Beatport Link" variant="outlined" />
                            )}
                        </Field>
                        <Field name="spotify_link">
                            {({ field }) => (
                                <TextField {...field} label="Spotify Link" variant="outlined" />
                            )}
                        </Field>
                        <Field name="apple_music_link">
                            {({ field }) => (
                                <TextField {...field} label="Apple Music Link" variant="outlined" />
                            )}
                        </Field>
                        <Field name="youtube_link">
                            {({ field }) => (
                                <TextField {...field} label="Youtube Link" variant="outlined" />
                            )}
                        </Field>
                        <Field name="soundcloud_link">
                            {({ field }) => (
                                <TextField {...field} label="Soundcloud Link" variant="outlined" />
                            )}
                        </Field>

                        <Field name="description">
                            {({ field }) => (
                                <TextField
                                    {...field}
                                    label="Description"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                />
                            )}
                        </Field>


                        <Button className="btn-add" type='submit ' variant="contained" color="success" disabled={isSubmitting}>
                            {isSubmitting ? 'Adding...' : 'Add'}
                        </Button>

                    </Stack>
                </Form>
            )}
        </Formik>
    );
};

export default ReleaseForm;
