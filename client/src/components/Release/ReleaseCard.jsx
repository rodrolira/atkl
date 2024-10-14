/* eslint-disable no-unused-vars */
// components/ReleaseCard.js
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import EditReleaseModal from './EditRelease/EditReleaseModal';
import { useReleases } from '@/contexts/ReleaseContext';
import { getReleaseRequest } from '@/app/api/releases';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import ReleaseLinks from './ReleaseLinks';
import BaseCard from '@/components/Layout/BaseCard';
  import { useTranslation } from 'react-i18next';

const ReleaseCard = ({ release }) => {
  const { t } = useTranslation();
  const [currentRelease, setCurrentRelease] = useState(release);
  const { deleteRelease, setReleases } = useReleases();
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (release?.id) {
      const fetchRelease = async () => {
        try {
          const response = await getReleaseRequest(release.id);
          setCurrentRelease(response.data);
        } catch (error) {
          console.error('Error fetching release:', error);
        }
      };

      fetchRelease();
    }
  }, [release?.id]);

  const handleDelete = async () => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar el lanzamiento ${currentRelease.title}?`,
      )
    ) {
      try {
        await deleteRelease(release.id);
        setReleases((prevReleases) =>
          prevReleases.filter((r) => r.id !== currentRelease.id),
        );
      } catch (error) {
        console.error('Error deleting release:', error);
      }
    }
  };

  const openEditModal = () => {
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    // Fetch release again to get updated data
    if (currentRelease?.id) {
      const fetchRelease = async () => {
        try {
          const response = await getReleaseRequest(currentRelease.id);
          setCurrentRelease(response.data);
        } catch (error) {
          console.error('Error fetching release:', error);
        }
      };
      fetchRelease();
    }
  };

  if (!currentRelease) {
    return <div>Loading...</div>; // Render a loading state or message
  }

  return (
    <>
      <BaseCard>
        <div className="w-full rounded-t-lg overflow-hidden relative">
          <h3 className="text-xl font-bold mt-2">{currentRelease.title}</h3>
          {currentRelease.artists && currentRelease.artists.length > 0 ? (
            currentRelease.artists.map((artist, index) => (
              <Link
                to={`/artists/${artist.id || index}`}
                className="block relative"
                key={artist.id || index}
              >
                <h3 className="xs:text-lg lg:h-auto sm:h-min font-bold xs:mt-2">
                  {artist.artist_name}
                </h3>
              </Link>
            ))
          ) : (
            <h3 className="text-lg lg:h-auto sm:h-min font-bold mt-2">
              No Artists
            </h3>
          )}
          <img
            src={`http://localhost:3000/${currentRelease.cover_image_url}`}
            alt={currentRelease.title}
            className="w-full"
          />

          {adminAuthenticated && (
            <div className="absolute top-2 right-2 flex space-x-2">
              <button
                className="text-xl mx-2 text-yellow-400 hover:text-yellow-500"
                onClick={openEditModal}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>

              <button
                onClick={handleDelete}
                aria-label="Delete Release"
                className="text-red-400 hover:text-red-500 text-xl mx-2"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          )}
        </div>
        <ReleaseLinks release={currentRelease} />

        <div className="my-2">
          {currentRelease.bandcamp_link && (
            <Button
              href={currentRelease.bandcamp_link}
              className="mb-4"
              colorClass="bg-green-500 hover:bg-green-600 text-black"
            >
              <p className="font-semibold">{t('buy')}</p>
            </Button>
          )}
        </div>
        {showEditModal && (
          <Modal onClose={closeEditModal}>
            <EditReleaseModal id={currentRelease.id} onClose={closeEditModal} />
          </Modal>
        )}
      </BaseCard>
    </>
  );
};

ReleaseCard.propTypes = {
  release: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    cover_image_url: PropTypes.string,
    artists: PropTypes.arrayOf(
      PropTypes.shape({
        artist_name: PropTypes.string,
      }),
    ),
    bandcamp_link: PropTypes.string,
    spotify_link: PropTypes.string,
    apple_music_link: PropTypes.string,
    youtube_link: PropTypes.string,
    soundcloud_link: PropTypes.string,
  }).isRequired,
};

export default ReleaseCard;
