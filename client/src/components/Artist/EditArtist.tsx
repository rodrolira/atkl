import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Navbar from '@/components/Navbar/Navbar';
import Button from '@/components/Button/Button';
import FileUpload from '@/components/Upload/FileUpload';
import { getArtistRequest } from '../../app/api/artists';
import { useArtists } from '../../contexts/ArtistContext';
import { ArtistFormValues } from './ArtistFormInterfaces';

const validationSchema = Yup.object().shape({
  artistName: Yup.string().required('Artist name is required'),
  image: Yup.mixed(),
  role: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one role must be selected')
    .test('both-roles', 'Both DJ and Producer must be selected together', (value) => {
      return value && (value.includes('DJ') && value.includes('Producer'));
    }),
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

const EditArtist: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<ArtistFormValues>({
    artistName: '',
    image: '',
    role: [],
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
  });

  const { updateArtist, deleteArtist } = useArtists();

  useEffect(() => {
    if (id) {
      fetchArtist(id);
    }
  }, [id]);

  const fetchArtist = async (artistId: string) => {
    try {
      const response = await getArtistRequest(artistId);
      setInitialValues(response.data);
    } catch (error) {
      console.error('Error fetching artist:', error);
    }
  };

  const handleSubmit = async (values: ArtistFormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    const formData = new FormData();
    for (const key in values) {
      if (key === 'role') {
        formData.append('role', values.role.join(','));
      } else {
        const value = values[key as keyof ArtistFormValues];
        if (Array.isArray(value)) {
        formData.append(key, value.join(','));
        } else if ((value as any) instanceof Blob) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    }

    try {
      if (id) {
        await updateArtist(id, formData);
        navigate(`/artists/${id}`);
      }
    } catch (error) {
      console.error('Error updating artist:', error);
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this artist?')) {
      try {
        if (id) {
          await deleteArtist(id);
          navigate('/artists');
        }
      } catch (error) {
        console.error('Error deleting artist:', error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center mt-32">
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <h2 className="text-2xl text-center text-gray-700 mb-4 font-bold">Edit Artist</h2>
              <div className="mb-4">
                <label htmlFor="artistName" className="block text-gray-700 font-bold mb-2">
                  Artist Name
                </label>
                <Field
                  type="text"
                  id="artistName"
                  name="artistName"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Artist Name"
                  autoComplete="off"
                  autoFocus
                />
                <ErrorMessage name="artistName" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="mb-4">
                <FileUpload name="image" setFieldValue={setFieldValue} />
              </div>
              <div className="mb-4">
                <label htmlFor="role" className="block text-gray-700 font-bold mb-2">
                  Role
                </label>
                <Field
                  as="select"
                  multiple
                  id="role"
                  name="role"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="DJ">DJ</option>
                  <option value="Producer">Producer</option>
                </Field>
                <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
                {values.role.includes('DJ') && values.role.includes('Producer') && (
                  <div className="mt-2 text-gray-600">DJ / Producer</div>
                )}
              </div>
              {/* Additional Fields for Social Links */}
              {/* Similar structure for other fields */}
              <div className="flex items-center justify-between">
                <Link to={`/artists/${id}`} className="btn btn-cancel">
                  Cancel
                </Link>
                <button type="submit" className="btn btn-save" disabled={isSubmitting}>
                  Save
                </button>
                <Button type="button" className="btn btn-delete" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default EditArtist;
