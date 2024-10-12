import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '@/components/Button/Button';
import FileUpload from '@/components/Upload/FileUpload';

import { getArtistRequest, getRolesRequest } from '@/app/api/artists';
import { useArtists } from '@/contexts/ArtistContext';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Title from '../../atoms/Title/Title';

const validationSchema = Yup.object().shape({
  artist_name: Yup.string(),
  image: Yup.mixed(),
});

function EditArtistModal({ id, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    artist_name: '',
    image: '',
    twitter_link: '',
    instagram_link: '',
    facebook_link: '',
    soundcloud_link: '',
    bandcamp_link: '',
    roleIds: [], // Initialize as an empty array for multiple selection
    bio: '',
  });
  const [roles, setRoles] = useState([]);
  const { updateArtist, deleteArtist } = useArtists();

  useEffect(() => {
    console.log('Artist ID:', id);
    fetchArtist(id);
  }, [id]);

  const fetchArtist = async (artist_id) => {
    try {
      const response = await getArtistRequest(artist_id);
      console.log('Artist:', response.data);
      const roles = response.data?.roles ?? [];
      console.log('Roles:', roles); // Verifica los roles antes de usarlos

      setInitialValues({
        ...response.data,
        roleIds: roles.map((role) => role.id),
      });
    } catch (error) {
      console.error('Error fetching artist:', error);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      if (key === 'roleIds') {
        formData.append(key, values[key].join(','));
      } else if (key === 'image' && values[key]) {
        formData.append(key, values[key]);
      } else {
        formData.append(key, values[key]);
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
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
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
              <FileUpload />
            </div>
            <FormControl className="!mb-4 !block" fullWidth variant="outlined">
              <InputLabel className="!block !text-gray-700 !font-bold !mb-2">
                {t('addArtist.selectRole')}
              </InputLabel>
              <Field
                className="!shadow !appearance-none !border !rounded !w-full !text-gray-700 !leading-tight !focus:!outline-none !focus:!shadow-outline"
                as={Select}
                name="roleIds"
                multiple
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.label}
                  </MenuItem>
                ))}
              </Field>
            </FormControl>
            <div className="mb-4">
              <label
                htmlFor="bio"
                className="block text-gray-700 font-bold mb-2"
              >
                Bio
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
            <div className="mb-4">
              <label
                htmlFor="twitter_link"
                className="block text-gray-700 font-bold mb-2"
              >
                Twitter Link
              </label>
              <Field
                type="text"
                id="twitter_link"
                name="twitter_link"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Twitter Link"
              />
              <ErrorMessage
                name="twitter_link"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="instagram_link"
                className="block text-gray-700 font-bold mb-2"
              >
                Instagram Link
              </label>
              <Field
                type="text"
                id="instagram_link"
                name="instagram_link"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Instagram Link"
              />
              <ErrorMessage
                name="instagram_link"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="facebook_link"
                className="block text-gray-700 font-bold mb-2"
              >
                Facebook Link
              </label>
              <Field
                type="text"
                id="facebook_link"
                name="facebook_link"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Facebook Link"
              />
              <ErrorMessage
                name="facebook_link"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="soundcloud_link"
                className="block text-gray-700 font-bold mb-2"
              >
                SoundCloud Link
              </label>
              <Field
                type="text"
                id="soundcloud_link"
                name="soundcloud_link"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="SoundCloud Link"
              />
              <ErrorMessage
                name="soundcloud_link"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="bandcamp_link"
                className="block text-gray-700 font-bold mb-2"
              >
                Bandcamp Link
              </label>
              <Field
                type="text"
                id="bandcamp_link"
                name="bandcamp_link"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Bandcamp Link"
              />
              <ErrorMessage
                name="bandcamp_link"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <div className="flex items-center justify-around sm:justify-between w-full flex-wrap">
              <Link
                type="button"
                onClick={onClose} // Cambia a navigate para cerrar el modal
                className="btn btn-cancel h-10 mt-2"
              >
                Cancel
              </Link>
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
}

export default EditArtistModal;
