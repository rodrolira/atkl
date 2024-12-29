import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import FileUpload from '../Upload/FileUpload';
import { useArtists } from '@/contexts/ArtistContext';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Title from '../atoms/Title/Title';
import { Artist } from '@/types/interfaces/Artist';
import { Role } from '@/types/interfaces/Role';
import { EditArtistModalProps } from '@/types/props/Form/ArtistFormProps';

const validationSchema = Yup.object().shape({
  artist_name: Yup.string().required('Artist name is required'),
  image: Yup.mixed(),
  roles: Yup.array().required('Role is required'),
  bio: Yup.string(),
});

const EditArtistModal: React.FC<EditArtistModalProps> = ({ id, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { artists, updateArtist, deleteArtist } = useArtists();
  const [initialValues, setInitialValues] = useState<Partial<Artist>>({
    artist_name: '',
    image: null,
    roles: [],
    bio: '',
  });
  const [roles] = useState([
    { id: 1, label: 'Producer' },
    { id: 2, label: 'DJ' },
  ]);

  useEffect(() => {
    const artist = artists.find((artist) => artist.id === id);
    if (artist) {
      setInitialValues({
        artist_name: artist.artist_name || '',
        image: artist.image || null,
        roles: artist.roles || [],
        bio: artist.bio || '',
      });
    }
  }, [id, artists]);


  const handleSubmit = async (values: any) => {
    console.log('Updated Artist:', values);
    onClose();
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this artist?')) {
      try {
        deleteArtist(id);
        navigate('/artists');
      } catch (error) {
        console.error('Error deleting artist:', error);
      }
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
            <FileUpload />
            <RolesSelection
              roles={roles}
              setFieldValue={setFieldValue}
              values={values}
              t={t}
            />
            <FieldInput fieldName="bio" label="Bio:" as="textarea" />
            <SocialLinksInput t={t} />
            <ActionButtons
              isSubmitting={isSubmitting}
              onClose={onClose}
              onDelete={handleDelete}
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
  roles: Role[];
  setFieldValue: (field: string, value: any) => void;
  values: any;
  t: (key: string) => string;
}> = ({ roles, setFieldValue, values, t }) => (
  <FormControl className="mb-4" fullWidth variant="outlined">
    <InputLabel>{t('addArtist.selectRole')}:</InputLabel>
    <Field
      name="roles"
      as={Select}
      className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      value={values.roles || []} // Aseguramos un array vacío como valor predeterminado
      onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
        setFieldValue('roles', event.target.value as number[]);
      }}
    >
      {roles.map((role) => (
        <MenuItem key={role.id} value={role.id}>
          {role.label}
        </MenuItem>
      ))}
    </Field>
    {roles.length === 0 && (
      <ErrorMessage name="roles" component="div" className="error-message" />
    )}
  </FormControl>
);

const SocialLinksInput: React.FC<{ t: any }> = ({ t }) => (
  <>
    {[
      'twitter_link',
      'instagram_link',
      'facebook_link',
      'soundcloud_link',
      'bandcamp_link',
      'youtube_link',
      'spotify_link',
      'apple_music_link',
      'beatport_link',
    ].map((link) => (
      <FieldInput key={link} fieldName={link} label={t(`social_links.${link}`)} />
    ))}
  </>
);

const ActionButtons: React.FC<{ isSubmitting: boolean; onClose: () => void; onDelete: () => void }> = ({
  isSubmitting,
  onClose,
  onDelete,
}) => (
  <div className="flex items-center justify-between">
    <button type="button" onClick={onClose} className="btn btn-cancel h-10 mb-2">
      Cancel
    </button>
    <button type="submit" className="btn btn-save h-10 mb-2" disabled={isSubmitting}>
      Save
    </button>
    <button type="button" className="btn btn-delete h-10 mb-2" onClick={onDelete}>
      Delete
    </button>
  </div>
);

export default EditArtistModal;
