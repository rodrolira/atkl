import React, { useMemo, useCallback, useState } from 'react';
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

interface ArtistCardProps {
  artist: Artist
}


const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const { deleteArtist } = useArtists();
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const { t } = useTranslation();

  // ✅ Usamos solo Cloudinary para las imágenes
  const imageUrl = useMemo(() => {
    return artist.imageUrl || artist.image || '/images/artists/placeholder.png';
  }, [artist.imageUrl, artist.image]);

  // Manejo de eliminación de artista
  const handleDelete = useCallback(() => {
    if (!artist.id) return;
    if (window.confirm(t('delete_confirmation', { artistName: artist.artist_name }))) {
      deleteArtist(artist.id);
    }
  }, [t, deleteArtist, artist.id, artist.artist_name]);

  const openEditModal = useCallback(() => {
    setShowEditModal(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setShowEditModal(false);
  }, []);

  const rolesText = useMemo(() => {
    if (artist.Roles && artist.Roles.length > 0) {
      return artist.Roles.map((role) =>
        typeof role === 'object' ? role.label : `${role}`)
        .join(' / ');
    }
    return t('no_roles_assigned');
  }, [artist.Roles, t]);

  const memoizedEditButton = useMemo(() => (
    <Button aria-label={t('edit_artist')} onClick={openEditModal}>
      <FontAwesomeIcon icon={faEdit} className="text-metallic-gray hover:text-white text-xl mx-2" />
    </Button>
  ), [t, openEditModal]);

  const memoizedDeleteButton = useMemo(() => (
    <Button onClick={handleDelete} aria-label={t('delete_artist')}>
      <FontAwesomeIcon icon={faTrash} className="text-gray-400 hover:text-white text-xl mx-2" />
    </Button>
  ), [handleDelete]);

  return (
    <>
      <BaseCard>
        <div className="w-full rounded-t-lg relative">
          <Link to={`/artists/${artist.id}`} className="block relative z-0" rel='preload'>
            <img
              className="rounded-t-lg w-full h-96 object-cover"
              src={imageUrl} // Usar la URL obtenida de la función getImageUrl
              alt={artist.artist_name}
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

        <Link to={`/artists/${artist.id}`} className="block">
          <p className="text-2xl font-bold tracking-tight text-white text-center mb-2">
            {artist.artist_name}
          </p>
        </Link>

        <div className="mb-2 text-xl font-bold tracking-tight text-white text-center">
          {rolesText}
        </div>

        <ArtistLinks artist={artist} />
      </BaseCard>
      {showEditModal && (
        <Modal onClose={closeEditModal}>
          {artist.id && <EditArtistModal id={artist.id} onClose={closeEditModal} />}
        </Modal>
      )}
    </>
  );
};

export default React.memo(ArtistCard, (prevProps, nextProps) => {
  return prevProps.artist === nextProps.artist; // Compare shallow equality
});
