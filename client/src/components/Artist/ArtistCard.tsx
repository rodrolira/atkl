import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import Modal from '@/components/Modal/Modal';
import EditArtistModal from './EditArtistModal';
import { useArtists } from '@/contexts/ArtistContext';
import ArtistLinks from './ArtistLinks';
import { Button } from 'react-bootstrap';
import BaseCard from '../Layout/BaseCard';
import { useTranslation } from 'react-i18next';
import { Artist } from '@/types/interfaces/Artist';
import { artistData } from '@/data/artistData'; // Importar los datos de los artistas

interface ArtistCardProps {
  artist: Artist
}


const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const [currentArtist, setCurrentArtist] = useState<Artist>(artist);
  const { deleteArtist, setArtists, updateArtist } = useArtists();
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const { t } = useTranslation();

   // ✅ Usamos solo Cloudinary para las imágenes
   const imageUrl = useMemo(() => {
    return currentArtist?.imageUrl || '/images/artists/placeholder.png';
  }, [currentArtist?.imageUrl]);

  useEffect(() => {
    const artistFromContext = artistData.find((a) => a.id === artist.id);
    if (artistFromContext) {
      setCurrentArtist({
        ...artistFromContext,
        Roles: artistFromContext.roles,
        roleIds: [] as number[],
        imageUrl: artistFromContext.imageUrl || '/images/artists/placeholder.png',
      });
    }
  }, [artist.id]);


  // Manejo de eliminación de artista
  const handleDelete = useCallback(() => {
    if (!currentArtist.id) return;
    if (window.confirm(t('delete_confirmation', { artistName: artist.artist_name }))) {
      setArtists((prevArtists: Artist[]) =>
        prevArtists.filter((a) => a.id !== currentArtist.id)
      );
      deleteArtist(currentArtist.id);
    }
  }, [t, deleteArtist, setArtists, currentArtist.id, currentArtist.artist_name]);

  const openEditModal = useCallback(() => {
    setShowEditModal(true);
  }, []);

  const closeEditModal = useCallback((updatedArtist?: Artist) => {
    if (updatedArtist?.id) {
      setCurrentArtist(updatedArtist);
      updateArtist(updatedArtist.id, updatedArtist);
    }
    setShowEditModal(false);
  }, [updateArtist]);

  const rolesText = useMemo(() => {
    if (currentArtist.Roles && currentArtist.Roles.length > 0) {
      return currentArtist.Roles.map((role) =>
        typeof role === 'object' ? role.label : `${role}`)
        .join(' / ');
    }
    return t('no_roles_assigned');
  }, [currentArtist.Roles, t]);

  const memoizedEditButton = useMemo(() => (
    <Button aria-label={t('edit_artist')} onClick={openEditModal}>
      <FontAwesomeIcon icon={faEdit} className="text-yellow-400 hover:text-yellow-500 text-xl mx-2" />
    </Button>
  ), [t, openEditModal]);

  const memoizedDeleteButton = useMemo(() => (
    <Button onClick={handleDelete} aria-label={t('delete_artist')}>
      <FontAwesomeIcon icon={faTrash} className="text-red-400 hover:text-red-500 text-xl mx-2" />
    </Button>
  ), [handleDelete]);

  return (
    <>
      <BaseCard>
        <div className="w-full rounded-t-lg relative">
          <Link to={`/artists/${currentArtist.id}`} className="block relative z-0" rel='preload'>
            <img
              className="rounded-t-lg w-full h-96 object-cover"
              src={imageUrl} // Usar la URL obtenida de la función getImageUrl
              alt={currentArtist.artist_name}
              loading="lazy"
            />
          </Link>

          {adminAuthenticated && (
            <div className="absolute right-2 top-2 flex space-x-2">
              {memoizedEditButton}
              {memoizedDeleteButton}
            </div>
          )}
        </div>

        <Link to={`/artists/${currentArtist.id}`} className="block">
          <p className="text-2xl font-bold tracking-tight text-white text-center mb-2">
            {currentArtist.artist_name}
          </p>
        </Link>

        <div className="mb-2 text-xl font-bold tracking-tight text-white text-center">
          {rolesText}
        </div>

        <ArtistLinks artist={currentArtist} />
      </BaseCard>
      {showEditModal && (
        <Modal onClose={() => closeEditModal()}>
          {currentArtist.id && <EditArtistModal id={currentArtist.id} onClose={closeEditModal} />}
        </Modal>
      )}
    </>
  );
};

export default React.memo(ArtistCard, (prevProps, nextProps) => {
  return prevProps.artist === nextProps.artist; // Compare shallow equality
});
