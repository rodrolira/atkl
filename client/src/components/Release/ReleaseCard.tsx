import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
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
import BandcampPlayer from './BandcampPlayer';
import { Genre } from '@/types/interfaces/Genre';
import { creditosSinFicha } from '@/utils/creditos';

interface ReleaseCardProps {
  release: Release;
}

const ReleaseCard: React.FC<ReleaseCardProps> = ({ release }) => {
  const { t } = useTranslation();
  const [currentRelease, setCurrentRelease] = useState<Release | null>(release);
  const { setReleases, releases, deleteRelease } = useReleases();
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  // La BD guarda la URL completa de la portada, venga de Cloudinary (subida
  // desde el panel admin) o del CDN de Bandcamp (importada del sello).
  const imageUrl = useMemo(() => {
    return currentRelease?.imageUrl || '/images/placeholder.svg';
  }, [currentRelease?.imageUrl]);

  // El audio lo sirve Bandcamp. Antes acá había un handleAudioToggle que leía
  // release.audioUrl / release.tracks: ninguno de los dos existe en la API
  // (no hay columna de audio en la BD), así que el botón de play nunca hizo
  // nada. Se reemplazó por el reproductor embebido de Bandcamp.
  const bandcampAlbumId = currentRelease?.bandcamp_album_id;

  useEffect(() => {
    const releaseFromContext = releases.find((r) => r.id === release.id);
    if (releaseFromContext) {
      setCurrentRelease(releaseFromContext);
    }
  }, [release.id, releases]);

  const handleDelete = useCallback(async () => {
    if (window.confirm(t('delete_release_confirmation', { title: currentRelease?.title }))) {
      try {
        await deleteRelease(release.id);
        setReleases((prevReleases: Release[]) =>
          prevReleases.filter((r) => r.id !== release.id)
        );
      } catch (error) {
        console.error('Error deleting release:', error);
      }
    }
  }, [setReleases, release, currentRelease?.title, deleteRelease, t]);

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
    const vinculados = (currentRelease?.artists ?? []) as Artist[];
    // Nombres del crédito que no tienen ficha: invitados que no son del sello,
    // o artistas cuya ficha se borró del panel. Van sin link porque no hay
    // página a dónde ir.
    const sinFicha = creditosSinFicha(currentRelease?.artist_credit, vinculados);

    if (!vinculados.length && !sinFicha.length) {
      return <h3 className="text-lg lg:h-auto sm:h-min font-bold mt-2">{t('noArtists')}</h3>;
    }

    return (
      <>
        {vinculados.map((artist: Artist) =>
          artist.id ? (
            <Link to={`/artists/${artist.id}`} className="inline-flex min-h-11 items-center relative" key={artist.id}>
              <h3 className="xs:text-lg lg:h-auto sm:h-min font-bold xs:mt-2 hover:text-metallic-gray">
                {t('artist')}: {artist.artist_name}
              </h3>
            </Link>
          ) : (
            <p className="xs:text-lg lg:h-auto sm:h-min font-bold xs:mt-2 text-white" key={artist.artist_name}>
              {t('artist')}: {artist.artist_name}
            </p>
          )
        )}
        {sinFicha.map((nombre) => (
          <p className="xs:text-lg lg:h-auto sm:h-min font-bold xs:mt-2 text-white" key={nombre}>
            {t('artist')}: {nombre}
          </p>
        ))}
      </>
    );
  }, [currentRelease?.artists, currentRelease?.artist_credit, t]);

  const memoizedButton = useMemo(() => (
    currentRelease?.bandcamp_link ? (
      <Button to={currentRelease.bandcamp_link} className="mb-4" variant="primary">
        <p className="font-semibold">{t('buy')}</p>
      </Button>
    ) : null
  ), [currentRelease?.bandcamp_link, t]);

  if (!currentRelease) {
    return <div><Loading /></div>; // Render loading state
  }

  return (
    <>
      {/* h-full + columna: la celda de la grilla ya mide lo mismo para todas,
          esto hace que la tarjeta la ocupe entera en vez de quedar corta. */}
      <BaseCard className="flex h-full flex-col border border-metallic-gray/30">
        <div className="w-full rounded-t-lg overflow-hidden relative">
          {/* Alto mínimo para que la portada arranque a la misma altura en
              todas: el título puede ser de una o dos líneas, el género puede
              faltar y los artistas son uno por línea. */}
          <div className="flex min-h-[8.5rem] flex-col items-center justify-center px-2">
            <h3 className="text-xl font-bold mt-2 text-white tracking-tight uppercase line-clamp-2">{currentRelease.title}</h3>
            <p className="text-sm text-white">{currentRelease.genre?.name}</p>
            <p className="text-sm text-white">{currentRelease.release_type}</p>

            {artistLinks}
          </div>
          <div className='relative w-full'>
            <img
              src={imageUrl}
              alt={currentRelease.title}
              className="w-full aspect-square object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>

          {bandcampAlbumId && (
            <BandcampPlayer
              albumId={bandcampAlbumId}
              title={currentRelease.title}
              bandcampLink={currentRelease.bandcamp_link}
            />
          )}

          {adminAuthenticated && (
            <div className="absolute top-2 right-2 flex space-x-2">
              <button className="text-xl mx-2 text-metallic-gray hover:text-white" onClick={openEditModal}>
                {editIcon}
              </button>
              <button className="text-gray-400 hover:text-white text-xl mx-2" onClick={handleDelete}>
                {trashIcon}
              </button>
            </div>
          )}

        </div>

        {/* mt-auto: el pie queda abajo de todo, así los botones de Comprar
            quedan alineados entre tarjetas en vez de flotar donde termine
            cada reproductor. */}
        <div className="mt-auto">
          <ReleaseLinks release={currentRelease} />
          <div className="my-2">{memoizedButton}</div>
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

export default ReleaseCard;
