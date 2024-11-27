import React, { useEffect, useState, useMemo, useCallback } from 'react';
import isEqual from 'lodash/isEqual';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import Modal from '@/components/Modal/Modal';
import EditArtistModal from './EditArtistModal';
import { useArtists } from '@/contexts/ArtistContext';
import ArtistLinks from './ArtistLinks';
import { getArtistRequest } from '@/app/api/artists';
import { Button } from 'react-bootstrap';
import BaseCard from '../Layout/BaseCard';
import { useTranslation } from 'react-i18next';
import { Artist } from '@/types/interfaces/Artist';


interface ArtistCardProps {
  artist: Artist
}


const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const [currentArtist, setCurrentArtist] = useState<Artist>(artist);
  const { deleteArtist, setArtists } = useArtists();
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (artist?.id) {
      const fetchArtist = async () => {
        try {
          const response = await getArtistRequest(artist.id);
          // Only update state if fetched data is different
          if (!isEqual(response.data, currentArtist)) {
            setCurrentArtist(response.data);
          }
        } catch (error) {
          console.error('Error fetching artist:', error);
        }
      }
      fetchArtist();
    }
  }, [artist?.id]);

  const handleDelete = useCallback(async () => {
    if (window.confirm(t('delete_confirmation', { artistName: artist.artist_name }))) {
      try {
        await deleteArtist(artist.id);
        setArtists((prevArtists: Artist[]) => prevArtists.filter((a) => a.id !== currentArtist.id));
      } catch (error) {
        console.error('Error deleting artist:', error);
      }
    }
  }, [t, deleteArtist, artist.artist_name, artist.id, setArtists, currentArtist.id]);

  const openEditModal = useCallback(() => {
    setShowEditModal(true);
  }, []);

  const closeEditModal = () => {
    setShowEditModal(false);
    const fetchArtist = async () => {
      try {
        const response = await getArtistRequest(currentArtist.id);
        if (!isEqual(response.data, currentArtist)) {
          setCurrentArtist(response.data);
        }
      } catch (error) {
        console.error('Error fetching artist:', error);
      }
    };
    fetchArtist();
  };

  const rolesText = useMemo(() => {
    if (currentArtist.Roles && currentArtist.Roles.length > 0) {
      return currentArtist.Roles.map((role) => typeof role === 'object' ? role.label : `Role ID: ${role}`).join(' / ');
    }
    return t('no_roles_assigned');
  }, [currentArtist.Roles, t]);

  const editIconMemo = useMemo(() => (
    <FontAwesomeIcon icon={faEdit} className="text-yellow-400 hover:text-yellow-500 text-xl mx-2" />
  ), []);

  const trashIconMemo = useMemo(() => (
    <FontAwesomeIcon icon={faTrash} className="text-red-400 hover:text-red-500 text-xl mx-2" />
  ), []);

  return (
    <>
      <BaseCard>
        <div className="w-full rounded-t-lg relative">
          <Link to={`/artists/${currentArtist.id}`} className="block relative z-0" rel='preload'>
            <img
              className="rounded-t-lg w-full h-96 object-cover"
              src={`https://atkl-server.onrender.com/${currentArtist.image}`}
              alt={currentArtist.artist_name}
              loading="lazy"
            />
          </Link>

          {adminAuthenticated && (
            <div className="absolute right-2 top-2 flex space-x-2">
              <Button aria-label={t('edit_artist')} onClick={openEditModal}>
                {editIconMemo}
              </Button>
              <Button onClick={handleDelete} aria-label={t('delete_artist')}>
                {trashIconMemo}
              </Button>
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
        <Modal onClose={closeEditModal}>
          <EditArtistModal id={currentArtist.id} onClose={closeEditModal} />
        </Modal>
      )}
    </>
  );
};

export default ArtistCard;
