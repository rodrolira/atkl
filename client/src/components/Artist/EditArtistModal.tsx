import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Title from '../atoms/Title/Title';
import { EditArtistModalProps } from '@/types/props/Form/ArtistFormProps';
import FileUploadComponent from '../Upload/FileUploadComponent';
import { useArtists } from '@/contexts/ArtistContext';
import { Role } from '@/types/interfaces/Role';
import { getRolesRequest } from '@/app/api/roles';

const SOCIAL_FIELDS = [
  'twitter_link',
  'instagram_link',
  'facebook_link',
  'soundcloud_link',
  'bandcamp_link',
  'youtube_link',
  'spotify_link',
  'apple_music_link',
  'beatport_link',
];

const emptyValues = {
  artist_name: '',
  email: '',
  image: '' as string | File,
  roleIds: [] as number[],
  bio: '',
  twitter_link: '',
  instagram_link: '',
  facebook_link: '',
  soundcloud_link: '',
  bandcamp_link: '',
  youtube_link: '',
  spotify_link: '',
  apple_music_link: '',
  beatport_link: '',
};

const validationSchema = Yup.object().shape({
  artist_name: Yup.string().required('Artist name is required'),
  email: Yup.string().email().required('Email is required'),
  image: Yup.mixed(),
  roleIds: Yup.array().min(1, 'Role is required'),
  bio: Yup.string(),
});

const EditArtistModal: React.FC<EditArtistModalProps> = ({ id, onClose }) => {
  const { t } = useTranslation();
  const { updateArtist, createArtist, artists } = useArtists();
  const [initialValues, setInitialValues] = useState(emptyValues);
  const [roles, setRoles] = useState<Role[]>([]);

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

  useEffect(() => {
    if (!id) {
      return;
    }

    const artist = artists.find((item) => item.id === id);
    if (artist) {
      setInitialValues({
        ...emptyValues,
        artist_name: artist.artist_name,
        email: artist.email || '',
        image: artist.imageUrl || artist.image || '',
        roleIds: artist.roleIds || [],
        bio: artist.bio || '',
        ...SOCIAL_FIELDS.reduce(
          (links, field) => ({ ...links, [field]: artist[field] || '' }),
          {} as Record<string, string>
        ),
      });
    }
  }, [id, artists]);

  const handleSubmit = async (values: typeof emptyValues) => {
    try {
      if (id) {
        await updateArtist(id, values);
      } else {
        await createArtist(values);
      }
      onClose();
    } catch (error) {
      console.error('Error al guardar el artista:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center z-50 relative">
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="form-style">
            <Title className="title-style">{t('edit_artist')}</Title>
            <FieldInput fieldName="artist_name" label={t('artistName')} placeholder="Artist Name" />
            <FieldInput fieldName="email" label="Email" placeholder="artist@email.com" />
            <FileUploadComponent
              name='image'
              label="Image"
              setFieldValue={setFieldValue}
            />
            <RolesSelection
              setFieldValue={setFieldValue}
              values={values}
              t={t}
              roles={roles}
            />
            <FieldInput fieldName="bio" label="Bio:" as="textarea" />
            <SocialLinksInput t={t} />
            <ActionButtons
              isSubmitting={isSubmitting}
              onClose={onClose}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

const FieldInput: React.FC<{ fieldName: string; label: string; placeholder?: string; as?: any }> = ({
  fieldName,
  label,
  placeholder,
  as,
}) => (
  <div className="mb-4 flex items-center justify-center">
    <label htmlFor={fieldName} className="label-style me-4 block text-gray-300 font-bold mb-2 w-1/5">
      {label}
    </label>
    <Field
      type="text"
      id={fieldName}
      name={fieldName}
      as={as}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
    />
    <ErrorMessage name={fieldName} component="div" className="error-message" />
  </div>
);

const RolesSelection: React.FC<{
  setFieldValue: (field: string, value: any) => void;
  values: any;
  t: (key: string) => string;
  roles: Array<{ id: number; label: string }>;
}> = ({ setFieldValue, values, t, roles }) => (
  <FormControl className="mb-4" fullWidth variant="outlined">
    <InputLabel>{t('addArtist.selectRole')}:</InputLabel>
    <Field
      name="roleIds"
      as={Select}
      multiple
      value={values.roleIds || []}
      className="w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-center"
      onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
        setFieldValue(
          'roleIds',
          Array.isArray(e.target.value) ? e.target.value : []
        )
      }
    >
      {roles.map((role) => (
        <MenuItem key={role.id} value={role.id}>
          {role.label}
        </MenuItem>
      ))}
    </Field>
    <ErrorMessage name="roleIds" component="div" className="error-message" />
  </FormControl>
);

const SocialLinksInput: React.FC<{ t: any }> = ({ t }) => (
  <>
    {SOCIAL_FIELDS.map((link) => (
      <FieldInput key={link} fieldName={link} label={t(`social_links.${link}`)} />
    ))}
  </>
);

const ActionButtons: React.FC<{ isSubmitting: boolean; onClose: () => void }> = ({
  isSubmitting,
  onClose,
}) => (
  <div className="flex items-center justify-between">
    <button type="button" onClick={onClose} className="btn btn-cancel h-10 mb-2">
      Cancel
    </button>
    <button type="submit" className="btn btn-save h-10 mb-2" disabled={isSubmitting}>
      Save
    </button>
  </div>
);

export default EditArtistModal;
