import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import EditReleaseModal from './EditRelease/EditReleaseModal';
import { useReleases } from '@/contexts/ReleaseContext';
import { Link } from 'react-router-dom';
import ReleaseLinks from './ReleaseLinks';
import { useTranslation } from 'react-i18next';
import { Release } from '@/types/interfaces/Release';
import Loading from '../atoms/Loading/Loading';
import BaseCard from '../Layout/BaseCard';
import { Artist } from '@/types/interfaces/Artist';
import { getImageUrlReleases } from '@/utils/utils';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';

interface ReleaseCardProps {
  release: Release;
}

const ReleaseCard: React.FC<ReleaseCardProps> = ({ release }) => {
  const { t } = useTranslation();
  const [currentRelease, setCurrentRelease] = useState<Release | null>(release);
  const { setReleases, releases } = useReleases();
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const {
    setTrackList,
    setIsVisible,
    isPlaying,
    setIsPlaying,
    currentTrackUrl,
    setCurrentTrackUrl
  } = useMusicPlayer();

  
 // ✅ Usamos solo Cloudinary para la imagen del lanzamiento
 const imageUrl = useMemo(() => {
  return currentRelease?.imageUrl || '/images/releases/placeholder.png';
}, [currentRelease?.imageUrl]);


  // Obtener la URL del audio
  const audioUrl = useMemo(() => {
    return currentRelease?.audioKey
      ? `https://atkl.s3.us-east-1.amazonaws.com/${encodeURIComponent(currentRelease.audioKey)}`
      : null;
  }, [currentRelease?.audioKey]);

  // Manejo de la reproducción/pausa del audio
  const handleAudioToggle = () => {
    if (!audioUrl) {
      console.error('Audio URL not found');
      return;
    }

    if (currentTrackUrl === audioUrl && isPlaying) {
      setIsPlaying(false);
    } else {
      setTrackList([
        {
          url: audioUrl,
          title: currentRelease?.title || 'Unknown Title',
          tags: [currentRelease?.genre?.name || 'Unknown Genre'],
        },
      ]);
      setCurrentTrackUrl(audioUrl);
      setIsVisible(true);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const releaseFromContext = releases.find((r) => r.id === release.id);
    if (releaseFromContext) {
      setCurrentRelease(releaseFromContext);
    }
  }, [release.id, releases]);

  const handleDelete = useCallback(async () => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el lanzamiento ${currentRelease?.title}?`)) {
      try {
        await deleteRelease(release.id);
        setReleases((prevReleases: Release[]) =>
          prevReleases.filter((r) => r.id !== release.id)
        );
      } catch (error) {
        console.error('Error deleting release:', error);
      }
    }
  }, [setReleases, release, currentRelease?.title]);

  const openEditModal = useCallback(() => {
    setShowEditModal(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setShowEditModal(false);
  }, []);

  const editIcon = useMemo(() => <FontAwesomeIcon icon={faEdit} />, []);
  const trashIcon = useMemo(() => <FontAwesomeIcon icon={faTrash} />, []);

  // Renderizar links de artistas
  const artistLinks = useMemo(() => {
    if (currentRelease?.artists && currentRelease.artists.length > 0) {
      return currentRelease.artists.map((artist: Artist) =>
        artist.id ? (
          <Link to={`/artists/${artist.id}`} className="block relative" key={artist.id}>
            <h3 className="xs:text-lg lg:h-auto sm:h-min font-bold xs:mt-2 hover:text-purple-500">
              {t('artist')}: {artist.artist_name}
            </h3>
          </Link>
        ) : (
          <p className="xs:text-lg lg:h-auto sm:h-min font-bold xs:mt-2 text-white" key={artist.artist_name}>
            {t('artist')}: {artist.artist_name}
          </p>
        )
      );
    } else {
      return <h3 className="text-lg lg:h-auto sm:h-min font-bold mt-2">{t('noArtists')}</h3>;
    }
  }, [currentRelease?.artists, t]);

  const memoizedButton = useMemo(() => (
    currentRelease?.bandcamp_link ? (
      <Button to={currentRelease.bandcamp_link} className="mb-4" colorClass="bg-green-500 hover:bg-green-600 text-black">
        <p className="font-semibold">{t('buy')}</p>
      </Button>
    ) : null
  ), [currentRelease?.bandcamp_link, t]);

  if (!currentRelease) {
    return <div><Loading /></div>; // Render loading state
  }

  return (
    <>
      <BaseCard className="border !border-purple-500">
        <div className="w-full rounded-t-lg overflow-hidden relative">
          <h3 className="text-xl font-bold mt-2">{currentRelease.title}</h3>
          <p className="text-sm text-white">{currentRelease.genre?.name}</p>
          <p className="text-sm text-white">{t('releaseType')}: {currentRelease.release_type}</p>

          {artistLinks}
          <div className='relative w-full'>
            <img
              src={imageUrl}
              alt={currentRelease.title}
              className="w-full cursor-pointer"
              loading="lazy"
            />
            <button
              onClick={handleAudioToggle}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300"
              aria-label="Play/Pause Release"
            >
            <FontAwesomeIcon
              icon={isPlaying && currentTrackUrl === audioUrl ? faPause : faPlay}
              className="text-white text-5xl"
            />
            </button>
          </div>

          {adminAuthenticated && (
            <div className="absolute top-2 right-2 flex space-x-2">
              <button className="text-xl mx-2 text-yellow-400 hover:text-yellow-500" onClick={openEditModal}>
                {editIcon}
              </button>
              <button className="text-red-400 hover:text-red-500 text-xl mx-2" onClick={handleDelete}>
                {trashIcon}
              </button>
            </div>
          )}
        </div>

        <ReleaseLinks release={currentRelease} />
        <div className="my-2">{memoizedButton}</div>

        {showEditModal && (
          <Modal onClose={closeEditModal}>
            <EditReleaseModal id={currentRelease.id} onClose={closeEditModal} />
          </Modal>
        )}
      </BaseCard>
    </>
  );
};

export default ReleaseCard;

function deleteRelease(id: number) {
  throw new Error('Function not implemented.');
}
