// ArtistPage.tsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar/Navbar';
import { useArtistData } from '@/hooks/useArtistData'; // Hook personalizado
import Modal from '@/components/Modal/Modal';
import EditArtistModal from '@/components/Artist/EditArtist/EditArtistModal';
import ArtistDetails from '@/components/Artist/ArtistDetails';
import ArtistReleases from '@/components/Artist/ArtistReleases';
import ArtistBio from '@/components/Artist/ArtistBio';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import ArtistName from '@/components/Artist/ArtistName';

// Definimos la interfaz para los parámetros de la URL
interface Params {
  id: string;
  name: string;
  bio: string;
}
const ArtistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { artist, error, loading } = useArtistData(id); // Usando el hook personalizado
  const [showEditModal, setShowEditModal] = useState(false);
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();

  if (error) {
    return <div>Error al obtener los datos del artista</div>;
  }

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!artist) {
    return <div>No se encontró el artista</div>;
  }

  const openEditModal = () => setShowEditModal(true);
  const closeEditModal = () => setShowEditModal(false);

  return (
    <>
      <Navbar />
      <div className="inline-block w-full mt-24 sm:mt-32">
        <ArtistName
          name={artist.artist_name}
          adminAuthenticated={adminAuthenticated}
          openEditModal={openEditModal}
          textSize="text-4xl"
        />
        <div className="flex flex-wrap flex-col md:flex-row">
          <ArtistDetails
            artist={artist}
            adminAuthenticated={adminAuthenticated}
            openEditModal={openEditModal}
          />
          <div className="sm:w-2/3 p-4 text-white text-center">
            <ArtistBio artist={artist} language="en" />
            <ArtistReleases artist={artist} />
          </div>
        </div>
      </div>
      {showEditModal && (
        <Modal onClose={closeEditModal} aria-labelledby="edit-artist-modal">
          <EditArtistModal id={id} onClose={closeEditModal} />
        </Modal>
      )}
    </>
  );
}

export default ArtistPage;
