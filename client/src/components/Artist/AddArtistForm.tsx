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
import { motion } from 'framer-motion';
import { AddArtistFormProps } from '@/types/props/Form/ArtistFormProps';
import { Role } from '@/types/interfaces/Role';
import { Artist } from '@/types/interfaces/Artist';

const AddArtistForm: React.FC<AddArtistFormProps> = React.memo(({ openPopup, closePopup, onArtistAdded }) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  const [roles] = useState<Role[]>([
    { id: 1, label: 'Producer' },
    { id: 2, label: 'DJ' },
  ]);
  const { createArtist } = useArtists();

  const initialValues:Partial<Artist> ={
    artist_name: '',
    image:'',
    roleIds: [],
    bio: '',
  };
  const onSubmit = async (values: Artist, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    setSubmitting(true);

    try {
      await createArtist({...values, id: Date.now() });
      closePopup();
      onArtistAdded?.(values);
    } catch (error) {
      console.error('Error adding artist:', error);
      setError(t('error.addArtist'));
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
          borderRadius: '0px',
          margin: '0',
          backgroundColor: 'rgba(18, 46, 15, 0.9)',
        },
        component: motion.div,
        variants: modalVariants,
        initial: 'hidden',
        animate: openPopup ? 'visible' : 'hidden',
        exit: 'exit',
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
          initialValues={initialValues as Artist}
          enableReinitialize
          validationSchema={Yup.object().shape({
            artist_name: Yup.string().required(t('validation.artistNameRequired')),
            bio: Yup.string(),
            image: Yup.mixed(),
            roleIds: Yup.array().of(Yup.string()).required(t('validation.roleRequired')),
          })}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <Stack spacing={2} margin={2}>
                {renderField('artist_name', 'artist_name')}
                <FileUpload />

                <FormControl fullWidth variant="outlined">
                  <InputLabel>{t('addArtist.selectRole')}</InputLabel>
                  <Select
                    multiple
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

                </FormControl>
                <TextField
                  label={t('addArtist.bio')}
                  name="bio"
                  multiline
                  rows={4}
                  variant="outlined"
                  onChange={(e) => setFieldValue('bio', e.target.value)}
                />
                {renderSocialLinks(fields)}
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
});

const renderSocialLinks = (fields: string[]) => {
  return fields.map((linkField, index) => (
    <Field key={index} name={linkField}>
      {({ field, form }: { field: any; form: any }) => (
        <TextField
          {...field}
          label={linkField.replace('_link', '').toUpperCase()}
          variant="outlined"
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
