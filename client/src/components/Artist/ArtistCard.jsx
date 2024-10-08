import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import Modal from '@/components/Modal/Modal';
import EditArtistModal from './EditArtist/EditArtistModal';
import { useArtists } from '@/contexts/ArtistContext';
import ArtistLinks from './ArtistLinks';
import { getArtistRequest } from '@/app/api/artists';
import { useArtist } from '@/hooks/useArtist';
import { Button } from 'react-bootstrap';
import BaseCard from '@/components/Layout/BaseCard';
import { useTranslation } from 'react-i18next'; // Importa el hook

const ArtistCard = ({ artist }) => {
  const [currentArtist, setCurrentArtist] = useState(artist);
  const { setArtists } = useArtists();
  const { deleteArtist } = useArtist();
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();
  const [showEditModal, setShowEditModal] = useState(false);

  const { t } = useTranslation(); // Hook de traducción

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await getArtistRequest(artist.id);
        setCurrentArtist(response.data);
      } catch (error) {
        console.error('Error fetching artist:', error);
      }
    };

    fetchArtist();
  }, [artist.id]);

  const handleDelete = async () => {
    if (
      window.confirm(
        t('delete_confirmation', { artistName: artist.artist_name }),
      )
    ) {
      try {
        await deleteArtist(artist.id);
        setArtists((prevArtists) =>
          prevArtists.filter((a) => a.id !== artist.id),
        );
      } catch (error) {
        console.error('Error deleting artist:', error);
      }
    }
  };

  const openEditModal = () => {
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    const fetchArtist = async () => {
      try {
        const response = await getArtistRequest(currentArtist.id);
        setCurrentArtist(response.data);
      } catch (error) {
        console.error('Error fetching artist:', error);
      }
    };
    fetchArtist();
  };

  const rolesText =
    currentArtist.Roles && currentArtist.Roles.length > 0
      ? currentArtist.Roles.map((role) => role.label).join(' / ')
      : t('no_roles_assigned'); // Usar traducción para 'No roles assigned'

  return (
    <>
      <BaseCard>
        <div className="w-full rounded-t-lg relative">
          <Link
            to={`/artists/${currentArtist.id}`}
            className="block relative z-0"
          >
            <img
              className="rounded-t-lg w-full h-auto object-cover"
              src={`http://localhost:3000/${currentArtist.image}`}
              alt={currentArtist.artist_name}
            />
          </Link>

          {adminAuthenticated && (
            <div className="absolute right-2 top-2 flex">
              <Button
                className="!px-2"
                aria-label={t('edit_artist')}
                onClick={openEditModal}
              >
                <FontAwesomeIcon
                  icon={faEdit}
                  className="text-yellow-400 hover:text-yellow-500 text-xl"
                />
              </Button>

              <Button
                className="!px-2"
                onClick={handleDelete}
                aria-label={t('delete_artist')}
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  className="text-red-400 hover:text-red-500 text-xl"
                />
              </Button>
            </div>
          )}
        </div>

        <Link to={`/artists/${currentArtist.id}`} className="block relative">
          <h5 className="text-2xl font-bold tracking-tight text-white text-center mb-2">
            {currentArtist.artist_name}
          </h5>
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

ArtistCard.propTypes = {
  artist: PropTypes.shape({
    id: PropTypes.number.isRequired,
    artist_name: PropTypes.string.isRequired,
    image: PropTypes.string,
    username: PropTypes.string,
    password: PropTypes.string,
    email: PropTypes.string,
    bio: PropTypes.string,
    Roles: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        label: PropTypes.string,
      }),
    ),
  }).isRequired,
};

export default ArtistCard;
