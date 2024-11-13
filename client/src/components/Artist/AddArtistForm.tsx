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
import { getArtistRequest, getRolesRequest } from '@/app/api/artists';
import { motion } from 'framer-motion'; // Importamos framer-motion
import { AddArtistFormProps } from '@/types/props/Form/ArtistFormProps';
import { Role } from '@/types/interfaces/Role';
import { Artist } from '@/types/interfaces/Artist';

const AddArtistForm: React.FC<AddArtistFormProps> = ({ openPopup, closePopup, onArtistAdded, id }) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<Partial<Artist>>({
    id: Number(id),
    artist_name: '',
    email: '',
    username: '',
    password: '',
    bio: '',
    image: '',
    roleIds: [],
  });
  const [roles, setRoles] = useState<Role[]>([]); // Cambia `any` por un tipo más específico si lo tienes
  const { createArtist } = useArtists();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistData, rolesData] = await Promise.all([
          getArtistRequest(id),
          getRolesRequest(),
        ]);
        setInitialValues(artistData.data);
        setRoles(rolesData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchArtist = async (artist_id: number) => {
      try {
        const response = await getArtistRequest(artist_id);
        const artistRoles = response.data.roles || [];
        setInitialValues({
          ...response.data,
          roleIds: artistRoles.map((role: Role) => role.id),
        });
      } catch (error) {
        console.error('Error fetching artist:', error);
      }
    };
    if (id !== undefined) {
      fetchArtist(id);
    }
  }, [id]); // Agrega el id a la dependencia


  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getRolesRequest();
        if (response && response.data) {
          setRoles(response.data);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, [id]);


  const onSubmit = async (values: Artist, { setSubmitting }: any) => { // Cambia `any` por un tipo más específico
    setSubmitting(true);
    setTimeout(async () => {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        const value = values[key as keyof Artist];
        if (key === 'roleIds') {
          formData.append(key, values[key as keyof Artist]?.toString() ?? '');
        } else if (key === 'image' && (values[key])) {
          // Directly check if it's an instance of File
          formData.append(key, values[key]); // Cast to File
        } else {
          formData.append(key, value);
        }

      });

      // Add this log to debug the formData contents
      console.log('FormData:', formData.get('image')); // Check if the image is appended correctly

      const roleIdsValue = formData.get('roleIds');
      const roleIds = typeof roleIdsValue === 'string' ? roleIdsValue.split(',').map(Number) : [];

      const artistData: Artist = {
        id: Number(id),
        artist_name: formData.get('artist_name') as string,
        email: formData.get('email') as string,
        username: formData.get('username') as string,
        password: formData.get('password') as string,
        bio: formData.get('bio') as string,
        image: formData.get('image') as string,
        roleIds: roleIds,
        Roles: values.roleIds,
        twitter_link: formData.get('twitter_link') as string || '',
        instagram_link: formData.get('instagram_link') as string || '',
        facebook_link: formData.get('facebook_link') as string || '',
        soundcloud_link: formData.get('soundcloud_link') as string || '',
        bandcamp_link: formData.get('bandcamp_link') as string || '',
        youtube_link: formData.get('youtube_link') as string || '',
        spotify_link: formData.get('spotify_link') as string || '',

      };

      try {
        await createArtist(artistData);
        closePopup();
      } catch (error) {
        console.error('Error adding artist:', error);
        setError(t('error.addArtist'));
        setSubmitting(false);
      }
    }, 0)
  };



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
          backgroundColor: 'rgba(18, 46, 15, 0.9)',
          backgroundImage: 'none',

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
          initialValues={initialValues as Artist & Partial<Artist>}
          enableReinitialize
          validationSchema={Yup.object().shape({
            artist_name: Yup.string().required(
              t('validation.artistNameRequired'),
            ),
            username: Yup.string(),
            email: Yup.string()
              .email(t('validation.invalidEmail')),
            password: Yup.string()
              .min(6, t('validation.passwordMin')),
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
                <FileUpload />

                {/* Roles Section */}
                <FormControl fullWidth variant="outlined">
                  <InputLabel>{t('addArtist.selectRole')}</InputLabel>
                  <Field
                    name="roleIds"
                    as={Select}
                    multiple
                    value={values.roleIds}
                    onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
                      setFieldValue('roleIds', event.target.value as number[])
                    }>

                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.label}
                      </MenuItem>
                    ))}
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
