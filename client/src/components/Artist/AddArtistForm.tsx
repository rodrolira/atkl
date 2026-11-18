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
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useArtists } from '@/contexts/ArtistContext';
import { useTranslation } from 'react-i18next';
import FileUpload from '@/components/Upload/FileUpload';
import { motion } from 'framer-motion';
import { AddArtistFormProps } from '@/types/props/Form/ArtistFormProps';
import { Role } from '@/types/interfaces/Role';
import { Artist } from '@/types/interfaces/Artist';
import { getRolesRequest } from '@/app/api/roles';
import { mensajeDeError } from '@/utils/errores';

/**
 * Los campos leen los tokens de App.css, los mismos que usan Tailwind y el
 * tema de MUI. Antes el diálogo traía un verde fijo (rgba(18,46,15,.9)) que no
 * está en la paleta del sello —negro, gris metálico y rojo— y los campos no
 * tenían fondo propio, así que no se distinguía dónde se escribía.
 */
const campoSx = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgb(var(--surface))',
    borderRadius: 0,
    '& fieldset': { borderColor: 'rgb(var(--muted) / 0.4)' },
    '&:hover fieldset': { borderColor: 'rgb(var(--muted))' },
    '&.Mui-focused fieldset': { borderColor: 'rgb(var(--accent))', borderWidth: '1px' },
  },
  '& .MuiInputLabel-root': { color: 'rgb(var(--muted))' },
  '& .MuiInputLabel-root.Mui-focused': { color: 'rgb(var(--accent))' },
  '& .MuiOutlinedInput-input': { color: 'rgb(var(--text))' },
};

const AddArtistForm: React.FC<AddArtistFormProps> = React.memo(({ openPopup, closePopup, onArtistAdded }) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [guardado, setGuardado] = useState(false);

  const [roles, setRoles] = useState<Role[]>([]);
  const { createArtist } = useArtists();

  useEffect(() => {
    let cancelled = false;

    getRolesRequest()
      .then(({ data }) => {
        if (!cancelled) {
          setRoles(data);
        }
      })
      .catch((err) => {
        console.error('Error fetching roles:', err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const initialValues:Partial<Artist> ={
    artist_name: '',
    email: '',
    image:'',
    roleIds: [],
    bio: '',
  };
  const onSubmit = async (values: Artist, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    setSubmitting(true);

    setError(null);

    try {
      const created = await createArtist(values);
      // Confirmación antes de cerrar: si el diálogo desaparecía al instante,
      // no quedaba señal de que el alta hubiera funcionado.
      setGuardado(true);
      onArtistAdded?.(created);
      setTimeout(closePopup, 900);
    } catch (error) {
      // El motivo real lo manda el servidor (400 por campo inválido, 502 si
      // falló la imagen). Antes se mostraba siempre el mismo texto fijo.
      setError(mensajeDeError(error, t('errors.addArtist')));
    } finally {
      setSubmitting(false);
    }
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
          sx={campoSx}
          error={Boolean(form.errors[name] && form.touched[name])}
          helperText={form.errors[name] && form.touched[name] && form.errors[name]}
        />
      )}
    </Field>
  );

  const modalVariants = {
    hidden: { opacity: 0, x: '100vh' },
    visible: { opacity: 1, x: '0', transition: { type: 'spring', stiffness: 25 } },
    exit: { opacity: 0, x: '100vh', transition: { duration: 1.2 } },
  };

  return (
    <Dialog
      open={openPopup}
      onClose={closePopup}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 0,
          margin: 0,
          // Mismo tratamiento que los modales del panel (Modal.css): negro,
          // esquinas rectas y un borde gris de 1px.
          backgroundColor: 'rgb(var(--bg))',
          // MUI le pone un degradado propio al Paper en modo oscuro y aclaraba
          // el fondo por encima del token.
          backgroundImage: 'none',
          border: '1px solid rgb(var(--muted) / 0.4)',
          color: 'rgb(var(--text))',
        },
        component: motion.div,
        variants: modalVariants,
        initial: 'hidden',
        animate: openPopup ? 'visible' : 'hidden',
        exit: 'exit',
      }}
      scroll="body"
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
        {t('addArtist.title')}
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
          initialValues={initialValues as Artist}
          enableReinitialize
          validationSchema={Yup.object().shape({
            artist_name: Yup.string().required(t('validation.artistNameRequired')),
            email: Yup.string().email(t('validation.invalidEmail')).required(t('validation.emailRequired')),
            bio: Yup.string(),
            image: Yup.mixed(),
            roleIds: Yup.array().min(1, t('validation.roleRequired')),
          })}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, setFieldValue, values, errors, touched }) => (
            <Form>
              <Stack spacing={2} marginY={2}>
                {renderField('artist_name', 'artist_name')}
                {renderField('email', 'email', 'email')}
                <FileUpload />

                <FormControl fullWidth variant="outlined" sx={campoSx} error={Boolean(errors.roleIds && touched.roleIds)}>
                  <InputLabel>{t('addArtist.selectRole')}</InputLabel>
                  <Select
                    multiple
                    label={t('addArtist.selectRole')}
                    value={values.roleIds}
                    onChange={(e) => setFieldValue('roleIds', e.target.value)}
                    renderValue={(selected) =>
                      (selected as number[]).map((roleId) => roles.find((r) => r.id === roleId)?.label).join(', ')
                    }
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {/* El rol es obligatorio y su error no se mostraba: sin uno
                      elegido el botón de guardar no hacía nada visible. */}
                  <ErrorMessage name="roleIds" component="div" className="error-message" />
                </FormControl>
                <TextField
                  label={t('addArtist.bio')}
                  name="bio"
                  multiline
                  rows={4}
                  variant="outlined"
                  sx={campoSx}
                  onChange={(e) => setFieldValue('bio', e.target.value)}
                />

                <p className="pt-2 text-left text-xs font-semibold uppercase tracking-[0.2em] text-metallic-gray border-b border-metallic-gray/30 pb-1">
                  {t('addArtist.linksTitle')}
                </p>
                {renderSocialLinks(fields, t)}

                {error && <div className="error-message" role="alert">{error}</div>}
                {guardado && (
                  <div className="exito-message" role="status">{t('addArtist.guardado')}</div>
                )}
                <div className="flex items-center justify-between pt-2">
                  <button type="button" onClick={closePopup} className="btn btn-cancel h-10">
                    {t('cancel')}
                  </button>
                  <button type="submit" disabled={isSubmitting} className="btn btn-save h-10">
                    {isSubmitting ? t('guardando') : t('save')}
                  </button>
                </div>
              </Stack>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
});

const renderSocialLinks = (fields: string[], t: (key: string) => string) => {
  return fields.map((linkField, index) => (
    <Field key={index} name={linkField}>
      {({ field, form }: { field: any; form: any }) => (
        <TextField
          {...field}
          // Traducido en vez de `apple_music_link` → "APPLE_MUSIC": las claves
          // ya existían, las usa el formulario de editar artista.
          label={t(`social_links.${linkField}`)}
          variant="outlined"
          sx={campoSx}
          error={Boolean(form.errors[linkField] && form.touched[linkField])}
          helperText={form.errors[linkField] && form.touched[linkField] && form.errors[linkField]}
        />
      )}
    </Field>
  ));
};

const fields = [
  'bandcamp_link',
  'facebook_link',
  'instagram_link',
  'soundcloud_link',
  'twitter_link',
  'youtube_link',
  'spotify_link',
  'beatport_link',
  'apple_music_link',
];

export default React.memo(AddArtistForm);
