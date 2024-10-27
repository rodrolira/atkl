import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useArtists } from '@/contexts/ArtistContext';
import { useTranslation } from 'react-i18next';
import FileUpload from '@/components/Upload/FileUpload';
import { getRolesRequest } from '@/app/api/artists';
import { motion } from 'framer-motion'; // Importamos framer-motion
import { AddArtistFormProps } from '@/types/props/Form/ArtistFormProps';

const AddArtistForm: React.FC<AddArtistFormProps> = ({ openPopup, closePopup, onArtistAdded }) => {
  const { t } = useTranslation();
  const [roles, setRoles] = useState<any[]>([]); // Cambia `any` por un tipo más específico si lo tienes
  const [error, setError] = useState<string | null>(null);
  const { createArtist } = useArtists();

  const onSubmit = async (values: any, actions: any) => { // Cambia `any` por un tipo más específico
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key === 'roleIds') {
        formData.append(key, values[key].join(','));
      } else {
        formData.append(key, values[key]);
      }
    });

    const artistData = {
      id: values.id,
      artist_name: values.artist_name,
      email: values.email,
      username: values.username,
      password: values.password,
      bio: values.bio,
      image: values.image,
      roleIds: values.roleIds,
      Roles: values.roleIds,
    };

    if(artistData){
    try {
      const newArtist = await createArtist(artistData);
      actions.setSubmitting(false);
      closePopup();
      onArtistAdded && onArtistAdded(newArtist!);
    } catch (error) {
      console.error('Error adding artist:', error);
      setError(t('error.addArtist'));
      actions.setSubmitting(false);
    }
  } else {
    console.error('Error: artistData is undefined');
    setError(t('error.addArtist'));
    actions.setSubmitting(false);
  }};

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getRolesRequest();
        
        console.log('API Response:', response); // Check the response structure

        // Since the response is directly an array, no need to access `response.data`
        if (Array.isArray(response.data)) {
          setRoles(response.data);
        } else {
          console.error('Unexpected response format:', response);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        setError('Error fetching roles');
      }
    };

    fetchRoles();
  }, []);

  const renderField = (name: string, label: string, type: string = 'text', autoComplete: string = 'on') => (
    <Field name={name}>
      {({ field, form }: { field: any; form: any }) => (
        <TextField
          {...field}
          label={t(`label.${label}`)}
          variant="outlined"
          type={type}
          autoComplete={autoComplete}
          error={form.errors[name] && form.touched[name]}
          helperText={
            form.errors[name] && form.touched[name] && form.errors[name]
          }
        />
      )}
    </Field>
  );

  // Variants para animar el modal
  const modalVariants = {
    hidden: { opacity: 0, x: '100vh' }, // Parte fuera de la pantalla
    visible: {
      opacity: 1,
      x: '0',
      transition: { type: 'spring', stiffness: 25 },
    }, // Se desliza a su posición
    exit: { opacity: 0, x: '100vh', transition: { duration: 1.2 } }, // Se desliza hacia abajo cuando se cierra
  };

  return (
    <Dialog
      open={openPopup}
      onClose={closePopup}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '0px',
          margin: '0',
          display: 'inline-flex',
          flexDirection: 'column',
          position: 'relative',
          float: 'right',
        },
        component: motion.div, // Añade la animación
        variants: modalVariants, // Asigna las variantes
        initial: 'hidden', // Inicializa la animación en 'hidden'
        animate: openPopup ? 'visible' : 'hidden', // Trigger visibility based on open state
        exit: 'exit', // Animación en 'exit' cuando se cierra el modal
      }}
      scroll="body"
    >
      <DialogTitle style={{ textAlign: 'center' }}>
        {t('addArtist.title')}
        <IconButton style={{ float: 'right' }} onClick={closePopup}>
          <CloseIcon color="error" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={{
            artist_name: '',
            username: '',
            email: '',
            password: '',
            bio: '',
            image: '',
            roleIds: [], // Define como un array de strings
            bandcamp_link: '',
            facebook_link: '',
            instagram_link: '',
            soundcloud_link: '',
            twitter_link: '',
            youtube_link: '',
            spotify_link: '',
            beatport_link: '',
            apple_music_link: '',
          }}
          validationSchema={Yup.object().shape({
            artist_name: Yup.string().required(
              t('validation.artistNameRequired'),
            ),
            username: Yup.string().required(t('validation.usernameRequired')),
            email: Yup.string()
              .email(t('validation.invalidEmail'))
              .required(t('validation.emailRequired')),
            password: Yup.string()
              .min(6, t('validation.passwordMin'))
              .required(t('validation.passwordRequired')),
            bio: Yup.string(),
            image: Yup.mixed(),
            roleIds: Yup.array()
              .of(Yup.string())
              .required(t('validation.roleRequired')),
            bandcamp_link: Yup.string(),
            facebook_link: Yup.string(),
            instagram_link: Yup.string(),
            soundcloud_link: Yup.string(),
            twitter_link: Yup.string(),
            youtube_link: Yup.string(),
            spotify_link: Yup.string(),
            beatport_link: Yup.string(),
            apple_music_link: Yup.string(),
          })}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <Stack spacing={2} margin={2}>
                {renderField('artist_name', 'artist_name')}
                {renderField('username', 'username')}
                {renderField('email', 'email')}
                {renderField(
                  'password',
                  'password',
                  'password',
                  'current-password',
                )}
                <FileUpload/>

                {/* Roles Section */}
                <FormControl fullWidth variant="outlined">
                  <InputLabel>{t('addArtist.selectRole')}</InputLabel>
                  <Field name="roleIds">
                    {({ field, form }: { field: any; form: any }) => (
                      <Select
                        {...field}
                        multiple
                        label={t('addArtist.selectRole')}
                        onChange={(event) =>
                          setFieldValue('roleIds', event.target.value)
                        }
                        value={values.roleIds}
                        error={form.errors.roleIds && form.touched.roleIds}
                        renderValue={(selected: number[]) => {
                          // Muestra los nombres de los roles seleccionados
                          const selectedRoles = roles.filter(role => selected.includes(role.id));
                          return selectedRoles.map(role => role.label).join(' / ');
                        }}
                      >
                        {roles.map((role) => (
                          <MenuItem key={role.id} value={role.id}>
                            {role.label}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  </Field>
                </FormControl>

                <Stack spacing={1}>
                  <TextField
                    label={t('addArtist.bio')}
                    name="bio"
                    multiline
                    rows={4}
                    variant="outlined"
                  />
                </Stack>
                <Stack spacing={2}>
                  {[
                    'bandcamp_link',
                    'facebook_link',
                    'instagram_link',
                    'soundcloud_link',
                    'twitter_link',
                    'youtube_link',
                    'spotify_link',
                    'beatport_link',
                    'apple_music_link',
                  ].map((linkField, index) => (
                    <Field key={index} name={linkField}>
                      {({ field, form }: { field: any; form: any }) => (
                        <TextField
                          {...field}
                          label={t(linkField)}
                          variant="outlined"
                          error={
                            form.errors[linkField] && form.touched[linkField]
                          }
                          helperText={
                            form.errors[linkField] &&
                            form.touched[linkField] &&
                            form.errors[linkField]
                          }
                        />
                      )}
                    </Field>
                  ))}
                </Stack>
                {error && <div className="text-red-500">{error}</div>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mx-auto btn btn-save h-10 mt-2 font-bold flex justify-center !bg-[#24db13] text-[#122e0f]"
                >
                  {t('submit')}
                </button>
              </Stack>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddArtistForm;
