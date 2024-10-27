import React, { useEffect, useState } from 'react';
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
import BaseCard from '@/components/Layout/BaseCard';
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
          setCurrentArtist(response.data);
        } catch (error) {
          console.error('Error fetching artist:', error);
        }
      }
    fetchArtist();
    }
  }, [artist?.id]);

  const handleDelete = async () => {
    if (window.confirm(t('delete_confirmation', { artistName: artist.artist_name }))) {
      try {
        await deleteArtist(artist.id);
        setArtists((prevArtists: Artist[]) => prevArtists.filter((a) => a.id !== currentArtist.id));
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

  const rolesText = currentArtist.Roles && currentArtist.Roles.length > 0
  ? currentArtist.Roles.map((role) => typeof role === 'object' ? role.label : `Role ID: ${role}`).join(' / ')
  : t('no_roles_assigned')

  return (
    <>
      <BaseCard>
        <div className="w-full rounded-t-lg relative">
          <Link to={`/artists/${currentArtist.id}`} className="block relative z-0">
            <img
              className="rounded-t-lg w-full h-auto object-cover"
              src={`http://localhost:3000/${currentArtist.image}`}
              alt={currentArtist.artist_name}
            />
          </Link>

          {adminAuthenticated && (
            <div className="absolute right-2 top-2 flex space-x-4">
              <Button className="!px-4 !py-3" aria-label={t('edit_artist')} onClick={openEditModal} style={{minWidth: '48px', minHeight: '48px'}}>
                <FontAwesomeIcon icon={faEdit} className="text-yellow-400 hover:text-yellow-500 text-xl" />
              </Button>
              <Button className="!px-4 !py-3" onClick={handleDelete} aria-label={t('delete_artist')} style={{minWidth: '48px', minHeight: '48px'}}>
                <FontAwesomeIcon icon={faTrash} className="text-red-400 hover:text-red-500 text-xl"  />
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
