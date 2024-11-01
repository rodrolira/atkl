import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import FileUploadComponent from '../Upload/FileUploadComponent';

const validationSchema = Yup.object().shape({
  artist_name: Yup.string().required('Artist name is required'),
  image: Yup.mixed(),
  roleIds: Yup.array().required('Role is required'),
  bio: Yup.string(),
  twitter_link: Yup.string(),
  instagram_link: Yup.string(),
  facebook_link: Yup.string(),
  soundcloud_link: Yup.string(),
  bandcamp_link: Yup.string(),  
  youtube_link: Yup.string(),
  spotify_link: Yup.string(),  
  apple_music_link: Yup.string(),
  beatport_link: Yup.string(),
});

const EditArtistModal: React.FC<EditArtistModalProps> = ({ id, onClose}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<Partial<Artist>>({
    id: Number(id),
    artist_name: '',
    image: '',
    twitter_link: '',
    instagram_link: '',
    facebook_link: '',
    soundcloud_link: '',
    bandcamp_link: '',
    youtube_link: '',
    spotify_link: '',
    apple_music_link: '',
    beatport_link: '',
    roleIds: [],
    roles: [] as Role[],
    bio: '',
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const { updateArtist, deleteArtist } = useArtists();

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

    // Añade todos los campos, incluso los vacíos
    Object.keys(values).forEach((key) => {
      const value = values[key as keyof Artist];
        if (key === 'roleIds') {
          formData.append(key, values[key as keyof Artist]?.toString() ?? '');
      } else if (key === 'image' && value) {
        formData.append(key, value as File);
      } else {
        formData.append(key, value); // Asegura que se envíen como cadena vacía
      } 
    }); 

    // Verificación de campos en FormData antes de enviarlo
    console.log('FormData:', Array.from(formData.entries()));

    const roleIdsValue = formData.get('roleIds');
    const roleIds = typeof roleIdsValue === 'string' ? roleIdsValue.split(',').map(stringId => Number(stringId)) : [];

    // Crea el objeto de datos del artista, asegurando que los campos vacíos sean cadenas vacías
    const artistData: Artist = {
      id: Number(id),
      artist_name: formData.get('artist_name') as string,
      email: formData.get('email') as string,
      image: formData.get('image') as string,
      twitter_link: formData.get('twitter_link') as string || '',
      instagram_link: formData.get('instagram_link') as string || '',
      facebook_link: formData.get('facebook_link') as string || '',
      soundcloud_link: formData.get('soundcloud_link') as string || '',
      bandcamp_link: formData.get('bandcamp_link') as string || '',
      youtube_link: formData.get('youtube_link') as string || '',
      spotify_link: formData.get('spotify_link') as string || '',
      apple_music_link: formData.get('apple_music_link') as string || '',
      beatport_link: formData.get('beatport_link') as string || '',
      bio: formData.get('bio') as string || '',
      roleIds:  roleIds || [],
      Roles: values.roleIds,
    };


    try {
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
    <div className="flex flex-col items-center justify-center z-50 relative ">
      <Formik
        initialValues={initialValues as Artist & Partial<Artist>}
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

            {/* Image upload */}
            <div className="mb-4">
              <FileUpload />
            </div>

            {/* Roles Selection */}
            <FormControl className="!mb-4 !block" fullWidth variant="outlined">
              <InputLabel className="!block !text-gray-700 !font-bold !mb-2">
                {t('addArtist.selectRole')}:
              </InputLabel>
              <Field
                className="!shadow !appearance-none !border !rounded !w-full !text-gray-700 !leading-tight !focus:!outline-none !focus:!shadow-outline"
                name="roleIds"
                as={Select}
                multiple
                value={values.roleIds}
                id="roleIds"
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
              'apple_music_link',
              'beatport_link',
            ].map((link) => (
              <div className="mb-4 flex" key={link}>
                <label
                  htmlFor={link}
                  className="block text-gray-700 font-bold mb-2 w-1/5"
                >
                  {t(`social_links.${link}`)}:
                </label>
                <Field
                  type="text"
                  id={link}
                  name={link}
                  className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder={t(`${link}`) } 
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
