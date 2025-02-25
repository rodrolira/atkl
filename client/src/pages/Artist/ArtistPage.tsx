import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar/Navbar';
import { useArtistData } from '@/data/useArtistData';
import Modal from '@/components/Modal/Modal';
import EditArtistModal from '@/components/Artist/EditArtistModal';
import ArtistDetails from '@/components/Artist/ArtistDetails';
import ArtistReleases from '@/components/Artist/ArtistReleases';
import ArtistBio from '@/components/Artist/ArtistBio';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import ArtistName from '@/components/Artist/ArtistName';
import Loading from '@/components/atoms/Loading/Loading';
import { artistData } from '@/data/artistData';
import { releaseData } from '@/data/releaseData'; // Lista de lanzamientos
import { Artist } from '@/types/interfaces/Artist';
import { Release } from '@/types/interfaces/Release';

const ArtistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return <div>No se encontró el artista</div>;
  }

  const { artist, loading, error, refetch } = useArtistData(id);
  const [showEditModal, setShowEditModal] = useState(false);
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();

  if (error) {
    return <div>Error al obtener los datos del artista</div>;
  }

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  const currentArtist = artist || {
    ...artistData.find((artist) => artist.id === +id),
    Roles: artistData.find((artist) => artist.id === +id)?.roles || [],
    roleIds: [] as number[],
    imageUrl: artistData.find((artist) => artist.id === +id)?.imageUrl || '',
  } as Artist;

  if (!currentArtist) {
    return <div>No se encontró el artista</div>;
  }

  const artistReleases = releaseData.filter((release: Release) =>
    release.artists?.some((relArtist: Artist) => relArtist.id === currentArtist.id) ?? false
  );

  const openEditModal = () => setShowEditModal(true);
  const closeEditModal = () => setShowEditModal(false);

  return (
    <>
      <Navbar />
      <div className="inline-block w-full mt-24 sm:mt-32">
        <ArtistName
          id={+id}
          name={currentArtist.artist_name}
          adminAuthenticated={adminAuthenticated}
          openEditModal={openEditModal}
          textSize="text-4xl"
        />
        <div className="flex flex-wrap flex-col md:flex-row">
          <ArtistDetails
            artist={currentArtist}
            adminAuthenticated={adminAuthenticated}
            openEditModal={openEditModal}
          />
          <div className="sm:w-2/3 p-4 text-white text-center">
            <ArtistBio artist={currentArtist} />
            <ArtistReleases artist={currentArtist} releases={artistReleases} />
          </div>
        </div>
      </div>
      {showEditModal && (
        <Modal onClose={closeEditModal} aria-labelledby="edit-artist-modal">
          <EditArtistModal id={+id} onClose={closeEditModal} />
        </Modal>
      )}
    </>
  );
};

export default ArtistPage;
