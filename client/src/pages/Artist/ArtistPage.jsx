// ArtistPage.jsx
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '@/components/Navbar/Navbar'
// import { useArtistData } from '../../../hooks/useArtistData' // Hook personalizado
import Modal from "@/components/Modal/Modal"
import EditArtistModal from '@/components/Artist/EditArtistModal'
import ArtistDetails from '@/components/Artist/ArtistDetails'
import ArtistReleases from '@/components/Artist/ArtistReleases'
import ArtistBio from '@/components/Artist/ArtistBio'
// import { useAdminAuth } from '../../../contexts/AdminAuthContext'



function ArtistPage() {
    const { id } = useParams()
    // const { artist, error } = useArtistData(id) // Usando el hook personalizado
    const [showEditModal, setShowEditModal] = useState(false)
    // const { isAuthenticated: adminAuthenticated } = useAdminAuth()

    if (error) {
        return <div>Error al obtener los datos del artista</div>
    }

    if (!artist) {
        return <div>Cargando...</div>
    }

    const openEditModal = () => setShowEditModal(true)
    const closeEditModal = () => setShowEditModal(false)


    return (
        <>
            <Navbar />
            <div className="inline-block w-full mt-32">
                <div className="flex mt-12">
                    <ArtistDetails
                        artist={artist}
                        adminAuthenticated={adminAuthenticated}
                        openEditModal={openEditModal}
                    />
                    <div className="w-2/3 p-4 text-white text-center">
                        <ArtistBio artist={artist} language="en" />
                        <ArtistReleases artist={artist} />
                    </div>
                </div>
            </div>
            {showEditModal && (
                <Modal onClose={closeEditModal}>
                    <EditArtistModal id={id} onClose={closeEditModal} />
                </Modal>
            )}
        </>
    )
}

export default ArtistPage
