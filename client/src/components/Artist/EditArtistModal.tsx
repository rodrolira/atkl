import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FileUploadComponent from '../Upload/FileUploadComponent';
import { getArtistRequest, getRolesRequest, updateArtistRequest } from '@/app/api/artists';
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
  roleIds: Yup.array().required('Role is required'),
  bio: Yup.string(),
});

const EditArtistModal: React.FC<EditArtistModalProps> = ({ id, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<Partial<Artist>>(getInitialArtistValues(id));
  const [roles, setRoles] = useState<Role[]>([]);
  const { updateArtist, deleteArtist } = useArtists();

  useEffect(() => {
    fetchArtistData(id);
    fetchRoles();
  }, [id]);

  const fetchArtistData = async (artistId: number) => {
    try {
      const response = await getArtistRequest(artistId);
      setInitialValues(transformArtistResponse(response.data));
    } catch (error) {
      console.error('Error fetching artist:', error);
    }
  };

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

  const handleSubmit = async (values: Artist, { setSubmitting }: any) => {
    try {
      const artistData = createArtistData(values, id);
      await updateArtist(id, artistData);
      onClose();
    } catch (error) {
      console.error('Error updating artist:', error);
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this artist?')) {
      try {
        await deleteArtist(id);
        navigate('/artists');
      } catch (error) {
        console.error('Error deleting artist:', error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center z-50 relative">
      <Formik
        initialValues={initialValues as Artist & Partial<Artist>}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="form-style">
            <Title className="title-style">{t('edit_artist')}</Title>
            <FieldInput fieldName="artist_name" label={t('artistName')} placeholder="Artist Name" />
            <FileUploadComponent />
            <RolesSelection roles={roles} setFieldValue={setFieldValue} values={values} />
            <FieldInput fieldName="bio" label="Bio:" as="textarea" />
            <SocialLinksInput t={t} />
            <ActionButtons isSubmitting={isSubmitting} onClose={onClose} onDelete={handleDelete} />
          </Form>
        )}
      </Formik>
    </div>
  );
};

const getInitialArtistValues = (id: string) => ({
  id: Number(id),
  artist_name: '',
  image: '',
  roleIds: [],
  bio: '',
});

const transformArtistResponse = (data: any) => {
  const artistRoles = data.roles || [];
  return {
    ...data,
    roleIds: artistRoles.map((role: Role) => role.id),
  };
};

const createArtistData = (values: Artist, id: number) => {
  const roleIds = values.roleIds.map(Number);
  return { ...values, id: Number(id), roleIds };
};

const FieldInput: React.FC<{ fieldName: string; label: string; placeholder?: string; as?: any }> = ({
  fieldName,
  label,
  placeholder,
  as,
}) => (
  <div className="mb-4">
    <label htmlFor={fieldName} className="label-style">{label}</label>
    <Field
      type="text"
      id={fieldName}
      name={fieldName}
      as={as}
      className="input-style"
      placeholder={placeholder}
    />
    <ErrorMessage name={fieldName} component="div" className="error-message" />
  </div>
);

const RolesSelection: React.FC<{ roles: Role[]; setFieldValue: (field: string, value: any) => void; values: any }> = ({
  roles,
  setFieldValue,
  values,
}) => (
  <FormControl className="mb-4" fullWidth variant="outlined">
    <InputLabel>{t('addArtist.selectRole')}:</InputLabel>
    <Field
      name="roleIds"
      as={Select}
      multiple
      value={values.roleIds}
      onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
        setFieldValue('roleIds', event.target.value as number[]);
      }}
    >
      {roles.map((role) => (
        <MenuItem key={role.id} value={role.id}>
          {role.label}
        </MenuItem>
      ))}
    </Field>
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
  <div className="action-buttons-style">
    <button type="button" onClick={onClose} className="btn cancel-btn">Cancel</button>
    <button type="submit" className="btn save-btn" disabled={isSubmitting}>Save</button>
    <button type="button" className="btn delete-btn" onClick={onDelete}>Delete</button>
  </div>
);

export default EditArtistModal;
