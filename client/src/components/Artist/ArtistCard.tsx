import React, { useMemo, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import Modal from '@/components/Modal/Modal';
import EditArtistModal from './EditArtistModal';
import { useArtists } from '@/contexts/ArtistContext';
import ArtistLinks from './ArtistLinks';
import BaseCard from '../Layout/BaseCard';
import { useTranslation } from 'react-i18next';
import { Artist } from '@/types/interfaces/Artist';
import { imagenRecortada } from '@/utils/utils';

interface ArtistCardProps {
  artist: Artist
}


const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const { deleteArtist } = useArtists();
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const { t } = useTranslation();

  // La BD guarda la URL completa de Cloudinary. El recorte lo pedimos a
  // Cloudinary y no al navegador: ver imagenRecortada.
  const imageUrl = useMemo(
    () => imagenRecortada(artist.imageUrl || artist.image) ?? '/images/placeholder.svg',
    [artist.imageUrl, artist.image]
  );

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
    <button type="button" aria-label={t('edit_artist')} onClick={openEditModal}>
      <FontAwesomeIcon icon={faEdit} className="text-metallic-gray hover:text-white text-xl mx-2" />
    </button>
  ), [t, openEditModal]);

  const memoizedDeleteButton = useMemo(() => (
    <button type="button" onClick={handleDelete} aria-label={t('delete_artist')}>
      <FontAwesomeIcon icon={faTrash} className="text-gray-400 hover:text-white text-xl mx-2" />
    </button>
  ), [handleDelete, t]);

  return (
    <>
      <BaseCard className="flex h-full flex-col">
        <div className="w-full rounded-t-lg relative">
          <Link to={`/artists/${artist.id}`} className="block relative z-0" rel='preload'>
            <img
              // En móvil la tarjeta vive en media columna del carrusel: con el
              // h-96 fijo quedaba una tira de 165x384. Proporción fija abajo,
              // alto fijo desde md para no tocar la grilla de escritorio.
              className="rounded-t-lg w-full aspect-[4/5] object-cover md:aspect-auto md:h-96"
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

        {/* Tipografía más chica en móvil por el mismo motivo que la imagen: a
            24px un nombre como "Dolor de Cabeza" rompe la celda del carrusel. */}
        {/* mx-auto: la tarjeta es flex column, y sin esto el nombre se pega a
            la izquierda en vez de quedar centrado como el resto. */}
        <Link to={`/artists/${artist.id}`} className="mx-auto inline-flex min-h-11 items-center">
          <p className="text-lg md:text-2xl font-bold tracking-tight text-white text-center mb-2 break-words">
            {artist.artist_name}
          </p>
        </Link>

        <div className="mb-2 text-sm md:text-xl font-bold tracking-tight text-white text-center">
          {rolesText}
        </div>

        {/* mt-auto: los links quedan al pie en todas las tarjetas, sin importar
            si el nombre ocupa una línea o dos. */}
        <div className="mt-auto">
          <ArtistLinks artist={artist} />
        </div>
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
