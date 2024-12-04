import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar/Navbar';
import { useArtistData } from '@/hooks/Artist/useArtistData';
import Modal from '@/components/Modal/Modal';
import EditArtistModal from '@/components/Artist/EditArtistModal';
import ArtistDetails from '@/components/Artist/ArtistDetails';
import ArtistReleases from '@/components/Artist/ArtistReleases';
import ArtistBio from '@/components/Artist/ArtistBio';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import ArtistName from '@/components/Artist/ArtistName';
import Loading from '@/components/atoms/Loading/Loading';

const ArtistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return <div>No se encontró el artista</div>;
  }

  const { artist, loading, error, refetch } = useArtistData(id); // Usamos `refetch` para actualizar datos
  const [showEditModal, setShowEditModal] = useState(false);
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();

  if (error) {
    return <div>Error al obtener los datos del artista</div>;
  }

  if (loading) {
    return <div><Loading /></div>;
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
          id={+id}
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
            <ArtistBio artist={artist} />
            <ArtistReleases artist={artist} />
          </div>
        </div>
      </div>
      {showEditModal && (
        <Modal onClose={closeEditModal} aria-labelledby="edit-artist-modal">
          {/* Pasamos `refetch` para actualizar los datos al guardar */}
          <EditArtistModal id={+id} onClose={closeEditModal} />
        </Modal>
      )}
    </>
  );
};

export default ArtistPage;
