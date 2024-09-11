import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import Navbar from '@/components/Navbar/Navbar'
import Button from '@/components/Button/Button'
import FileUpload from '@/components/Upload/FileUpload'

// import { useArtists } from '../../../contexts/ArtistContext'
import { getArtistRequest } from '@/app/api/artists'

const validationSchema = Yup.object().shape({
    artistName: Yup.string().required('Artist name is required'),
    image: Yup.mixed(),
    role: Yup.array().of(Yup.string()).min(1, 'At least one role must be selected').test('both-roles', 'Both DJ and Producer must be selected together', (value) => {
        return value.includes('DJ') && value.includes('Producer') // Updated validation for role as an array of stringstialize as an empty array for multiple selection
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

})

function EditArtist() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [initialValues, setInitialValues] = useState({
        artistName: '',
        image: '',
        role: [], // Initialize as an empty array for multiple selection
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

    })

    const { updateArtist, deleteArtist } = useArtists()

    useEffect(() => {
        fetchArtist(id)
    }, [id])

    const fetchArtist = async artist_id => {
        try {
            const response = await getArtistRequest(artist_id)
            setInitialValues(response.data)
        } catch (error) {
            console.error('Error fetching artist:', error)
        }
    }

    const handleSubmit = async (values, { setSubmitting }) => {
        const formData = new FormData()
        for (const key in values) {
            if (key === 'role') {
                // Convert role to array if it's not already
                formData.append('role', Array.isArray(values.role) ? values.role.join(',') : values.role)
            } else {
                formData.append(key, values[key])
            }
        }

        try {
            await updateArtist(id, formData)
            navigate(`/artists/${id}`)
        } catch (error) {
            console.error('Error updating artist:', error)
            setSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this artist?')) {
            try {
                await deleteArtist(id)
                navigate('/artists')
            } catch (error) {
                console.error('Error deleting artist:', error)
            }
        }
    }

    return (
        <>
            <Navbar />
            <div className='flex flex-col items-center justify-center mt-32'>
                <Formik
                    initialValues={initialValues}
                    enableReinitialize
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className='w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
                            <h2 className='text-2xl mb-4 font-bold'>
                                Edit Artist
                            </h2>
                            <div className='mb-4'>
                                <label
                                    htmlFor='artistName'
                                    className='block text-gray-700 font-bold mb-2'
                                >
                                    Artist Name
                                </label>
                                <Field
                                    type='text'
                                    id='artistName'
                                    name='artistName'
                                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    placeholder='Artist Name'
                                    autoComplete='off'
                                    autoFocus
                                />
                                <ErrorMessage
                                    name='artistName'
                                    component='div'
                                    className='text-red-500 text-sm mt-1'
                                />
                            </div>
                            <div className='mb-4'>
                                <FileUpload />
                            </div>
                            <div className='mb-4'>
                                <label
                                    htmlFor='role'
                                    className='block text-gray-700 font-bold mb-2'
                                >
                                    Role
                                </label>
                                <Field
                                    as='select'
                                    multiple
                                    id='role'
                                    name='role'
                                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                >
                                    <option value='DJ'>DJ</option>
                                    <option value='Producer'>Producer</option>
                                </Field>
                                <ErrorMessage
                                    name='role'
                                    component='div'
                                    className='text-red-500 text-sm mt-1'
                                />
                                {/* Mostrar ambos roles seleccionados */}
                                {({ values }) => values.role.includes('DJ') && values.role.includes('Producer') && (
                                    <div className='mt-2 text-gray-600'>
                                        DJ / Producer
                                    </div>
                                )}

                            </div>
                            <div className='mb-4'>
                                <label
                                    htmlFor='twitterLink'
                                    className='block text-gray-700 font-bold mb-2'
                                >
                                    Twitter Link
                                </label>
                                <Field
                                    type='text'
                                    id='twitterLink'
                                    name='twitterLink'
                                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    placeholder='Twitter Link'
                                />
                                <ErrorMessage
                                    name='twitterLink'
                                    component='div'
                                    className='text-red-500 text-sm mt-1'
                                />
                            </div>
                            <div className='mb-4'>
                                <label
                                    htmlFor='instagram_link'
                                    className='block text-gray-700 font-bold mb-2'
                                >
                                    Instagram Link
                                </label>
                                <Field
                                    type='text'
                                    id='instagram_link'
                                    name='instagram_link'
                                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    placeholder='Instagram Link'
                                />
                                <ErrorMessage
                                    name='instagram_link'
                                    component='div'
                                    className='text-red-500 text-sm mt-1'
                                />
                            </div>
                            <div className='mb-4'>
                                <label
                                    htmlFor='facebook_link'
                                    className='block text-gray-700 font-bold mb-2'
                                >
                                    Facebook Link
                                </label>
                                <Field
                                    type='text'
                                    id='facebook_link'
                                    name='facebook_link'
                                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    placeholder='Facebook Link'
                                />
                                <ErrorMessage
                                    name='facebook_link'
                                    component='div'
                                    className='text-red-500 text-sm mt-1'
                                />
                            </div>
                            <div className='mb-4'>
                                <label
                                    htmlFor='soundcloud_link'
                                    className='block text-gray-700 font-bold mb-2'
                                >
                                    SoundCloud Link
                                </label>
                                <Field
                                    type='text'
                                    id='soundcloud_link'
                                    name='soundcloud_link'
                                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    placeholder='SoundCloud Link'
                                />
                                <ErrorMessage
                                    name='soundcloud_link'
                                    component='div'
                                    className='text-red-500 text-sm mt-1'
                                />
                            </div>
                            <div className='mb-6'>
                                <label
                                    htmlFor='bandcamp_link'
                                    className='block text-gray-700 font-bold mb-2'
                                >
                                    Bandcamp Link
                                </label>
                                <Field
                                    type='text'
                                    id='bandcamp_link'
                                    name='bandcamp_link'
                                    className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                                    placeholder='Bandcamp Link'
                                />
                                <ErrorMessage
                                    name='bandcamp_link'
                                    component='div'
                                    className='text-red-500 text-sm mt-1'
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <Link
                                    type='button'
                                    to={`/artists/${id}`}
                                    className='btn btn-cancel'
                                >
                                    Cancel
                                </Link>
                                <button
                                    type='submit'
                                    className='btn btn-save'
                                    disabled={isSubmitting}
                                >
                                    Save
                                </button>
                                <Button
                                    type='button'
                                    className='btn btn-delete'
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    )
}

export default EditArtist
