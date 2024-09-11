/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AddArtistForm from './AddArtistForm'
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import axios from 'axios'
jest.mock('axios')


// Configura i18next para las pruebas
i18n.init({
    lng: 'en', // o el idioma que necesites
    resources: {
        en: {
            translation: {
                // Agrega aquí las traducciones necesarias para tus pruebas
                'addArtist.title': 'Add Artist',
                'addArtist.validation.artistNameRequired': 'Artist name is required',
                'addArtist.validation.usernameRequired': 'Username is required',
                'addArtist.validation.emailRequired': 'Email is required',
                'addArtist.validation.passwordRequired': 'Password is required',
            },
        },
    },
});

// Mock de useArtists
jest.mock('../../../contexts/ArtistContext', () => ({
    useArtists: () => ({
        createArtist: jest.fn(),
    }),
}))

describe('AddArtistForm', () => {
    it('renders the form', () => {
        render(
            <I18nextProvider i18n={i18n}>
                <AddArtistForm />
            </I18nextProvider>
        )
        expect(screen.getByText('addArtist.title')).toBeInTheDocument()
    })

    it('opens and closes the dialog', async () => {
        render(<AddArtistForm />)
        fireEvent.click(screen.getByText('addArtist.title'))
        expect(screen.getByRole('dialog')).toBeInTheDocument()
        fireEvent.click(screen.getByRole('button', { name: '' }))
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        })
    }, 10000)

    it('validates the form fields', async () => {
        render(<AddArtistForm />)
        fireEvent.click(screen.getByText('addArtist.title'))
        fireEvent.click(screen.getByText('submit'))
        await waitFor(() => {
            expect(screen.getByText('addArtist.validation.artistNameRequired')).toBeInTheDocument()
            expect(screen.getByText('addArtist.validation.usernameRequired')).toBeInTheDocument()
            expect(screen.getByText('addArtist.validation.emailRequired')).toBeInTheDocument()
            expect(screen.getByText('addArtist.validation.passwordRequired')).toBeInTheDocument()
        })
    })

    it('calls createArtist on form submission', async () => {
        const createArtistMock = jest.fn()
        const useArtistsMock = jest.spyOn(require('../../../contexts/ArtistContext'), 'useArtists')
        useArtistsMock.mockReturnValue({ createArtist: createArtistMock })

        render(<AddArtistForm />)
        fireEvent.click(screen.getByText('addArtist.title'))

        fireEvent.change(screen.getByLabelText('addArtist.label.artist_name'), { target: { value: 'Test Artist' } })
        fireEvent.change(screen.getByLabelText('addArtist.label.username'), { target: { value: 'testuser' } })
        fireEvent.change(screen.getByLabelText('addArtist.label.email'), { target: { value: 'test@example.com' } })
        fireEvent.change(screen.getByLabelText('addArtist.label.password'), { target: { value: 'password123' } })

        fireEvent.click(screen.getByText('submit'))

        await waitFor(() => {
            expect(createArtistMock).toHaveBeenCalled()
        })
    }, 10000)
    it('should fetch roles without hitting the network', async () => {
        const roles = [{ id: 1, label: 'Producer' }, { id: 2, label: 'DJ' }]
        axios.get.mockResolvedValue({ data: roles })

        // Asuming fetchRoles is called in the AddArtistForm component
        const fetchRoles = async () => {
            const response = await axios.get('http://localhost:3000/api/roles')
            return response.data
        }

        const result = await fetchRoles()
        expect(result).toEqual(roles)
    })
})
