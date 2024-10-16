import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import FileUpload from '@/components/Upload/FileUpload';
import { getArtistRequest, getRolesRequest } from '@/app/api/artists';
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
});

const EditArtistModal: React.FC<EditArtistModalProps> = ({ id, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<Partial<Artist>>({
    artist_name: '',
    image: null,
    twitter_link: '',
    instagram_link: '',
    facebook_link: '',
    soundcloud_link: '',
    bandcamp_link: '',
    youtube_link: '',
    spotify_link: '',
    roleIds: [],
    bio: '',
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const { updateArtist, deleteArtist } = useArtists();

  useEffect(() => {
    const fetchArtist = async (artist_id: string) => {
      try {
        const response = await getArtistRequest(artist_id);
        console.log('Artist:', response.data);
        const roles = response.data?.roles ?? [];
        setInitialValues({
          ...response.data,
          roleIds: roles.map((role: Role) => role.id),
        });
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

    fetchArtist(id);
    fetchRoles();
  }, [id]);

  const handleSubmit = async (values: Artist, { setSubmitting }: any) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key in values) {
        if (key === 'roleIds') {
          formData.append(key, values[key as keyof Artist]?.toString() ?? '');
        } else if (key === 'image' && values[key as keyof Artist]) {
          formData.append(key, values[key as keyof Artist] as File);
        } else {
          formData.append(key, values[key as keyof Artist]?.toString() ?? '');
        }
      }
    });

    try {
      await updateArtist(id, formData);
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
    <div className="flex flex-col items-center justify-center">
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="w-full bg-white shadow-md rounded px-8 pt-2 pb-2 mb-4 text-center">
            <Title className="!text-3xl mb-4 font-bold text-center text-gray-700">
              {t('edit_artist')}
            </Title>
            <div className="mb-4">
              <label
                htmlFor="artist_name"
                className="block text-gray-700 font-bold mb-2"
              >
                {t('artistName')}
              </label>
              <Field
                type="text"
                id="artist_name"
                name="artist_name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Artist Name"
                autoComplete="off"
                autoFocus
              />
              <ErrorMessage
                name="artist_name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="mb-4">
              <FileUpload setFieldValue={setFieldValue} name="image" />
            </div>

            <FormControl className="!mb-4 !block" fullWidth variant="outlined">
              <InputLabel className="!block !text-gray-700 !font-bold !mb-2">
                {t('addArtist.selectRole')}:
              </InputLabel>
              <Field
                className="!shadow !appearance-none !border !rounded !w-full !text-gray-700 !leading-tight !focus:!outline-none !focus:!shadow-outline"
                as={Select}
                name="roleIds"
                multiple
                value={values.roleIds}
                onChange={(event: React.ChangeEvent<{ value: unknown }>) =>
                  setFieldValue('roleIds', event.target.value as number[])
                }
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.label}
                  </MenuItem>
                ))}
              </Field>
            </FormControl>

            <div className="mb-4">
              <label htmlFor="bio" className="block text-gray-700 font-bold mb-2">
                Bio:
              </label>
              <Field
                as="textarea"
                id="bio"
                name="bio"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Bio"
              />
              <ErrorMessage
                name="bio"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Social Links */}
            {[
              'twitter_link',
              'instagram_link',
              'facebook_link',
              'soundcloud_link',
              'bandcamp_link',
              'youtube_link',
              'spotify_link',
            ].map((link) => (
              <div className="mb-4 flex" key={link}>
                <label
                  htmlFor={link}
                  className="block text-gray-700 font-bold mb-2"
                >
                  {t(`social_links.${link}`)}:
                </label>
                <Field
                  type="text"
                  id={link}
                  name={link}
                  className="shadow appearance-none border ms-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder={`${link.replace('_', ' ')} Link`}
                />
                <ErrorMessage
                  name={link}
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            ))}

            {/* Action Buttons */}
            <div className="flex items-center justify-around sm:justify-between lg:justify-evenly mx-auto w-[50%] flex-wrap">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-cancel h-10 mt-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-save h-10 mt-2"
                disabled={isSubmitting}
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-delete h-10 mt-2"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditArtistModal;
