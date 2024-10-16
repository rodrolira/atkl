import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { ArtistsTableProps } from '@/types/props/Admin/ArtistsTableProps';



const ArtistsTable: React.FC<ArtistsTableProps> = ({
  artists = [],
  onEdit,
  onDelete,
  selectedArtists,
  setSelectedArtists,
  isDeleteMode,
}) => {
  const { t } = useTranslation();

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedArtists(artists);
    } else {
      setSelectedArtists([]);
    }
  };
  const handleSelectArtist = (id: number) => {
    setSelectedArtists((prev) => {
      const artistToToggle = artists.find(artist => artist.id === id);
      if (!artistToToggle) // Verificar si el artista no existe
        return prev;

      return prev.some((artist) => artist.id === id) // Verificar si el artista ya está seleccionado(id)
        ? prev.filter((artist) => artist.id !== id) // Eliminar el artista
        : [...prev, artistToToggle]; // Agregar el artista
    });
  };

  return (
    <div className="w-full overflow-x-auto border border-[#2e7728] rounded">
      {artists.length === 0 ? (
        <div className="text-white p-4">{t('availability.no_artists')}.</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#194116]">
              {isDeleteMode && (
                <th className="px-4 py-3 text-center w-1/12 text-white text-sm font-medium">
                  <input 
                    onChange={handleSelectAll}
                    type="checkbox"
                    className="text-[#8bd685] bg-[#194116] border-[#2e7728] border"
                    checked={selectedArtists.length === artists.length}
                  />
                </th>
              )}
              <th className="px-4 py-3 text-center w-1/4 text-white text-sm font-medium">
                {t('artistName')}
              </th>
              <th className="px-4 py-3 text-center w-1/4 text-white text-sm font-medium">
                Email
              </th>
              <th className="px-4 py-3 text-center w-1/4 text-white text-sm font-medium">
                {t('roles')}
              </th>
              {/* Nueva columna de roles */}
              <th className="px-4 py-3 text-center w-1/4 text-[#8bd685] text-sm font-medium">
                {t('actions')}
              </th>
            </tr>
          </thead>
          <tbody>
            {artists.map((artist) => (
                <tr key={artist.id} className="border-t border-t-[#2e7728]">
                  {isDeleteMode && (
                    <td className="px-4 py-3 w-1/12 text-center">
                      <input
                        type="checkbox"

                        checked={selectedArtists.some((selectedArtist) => selectedArtist.id === artist.id)}
                        onChange={() => handleSelectArtist(artist.id)}
                      />
                    </td>
                  )}
                  <td className="px-4 py-3 w-1/4 text-white text-sm">
                    {artist.artist_name}
                  </td>
                  <td className="px-4 py-3 w-1/4 text-[#8bd685] text-sm">
                    {artist.email}
                  </td>
                  <td className="px-4 py-3 w-1/4 text-white text-sm">
                    {artist.Roles && artist.Roles.length > 0
                      ? artist.Roles.map((role) => role.label).join(' / ') // Mostrar roles separados por "/"
                      : t('no_roles_assigned')}
                  </td>
                  <td className="px-4 py-3 w-1/4 text-center">
                    <button
                      className="text-xl mx-2 text-yellow-400 hover:text-yellow-500"
                      onClick={() => onEdit(artist)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => onDelete(artist.id)}
                      type="button"
                      className="text-red-400 hover:text-red-500 text-xl mx-2"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};


export default ArtistsTable;
