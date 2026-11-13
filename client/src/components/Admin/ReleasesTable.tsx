// ReleasesTable.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { ReleasesTableProps } from '@/types/props/Admin/ReleasesTableProps';
import { Artist } from '@/types/interfaces/Artist';

const formatReleaseDate = (value?: string) => {
  if (!value) {
    return '—';
  }
  const [year, month, day] = String(value).slice(0, 10).split('-');
  if (!year || !month || !day) {
    return '—';
  }
  return `${day}/${month}/${year}`;
};

const ReleasesTable: React.FC<ReleasesTableProps> = ({ releases, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full overflow-x-auto border border-metallic-gray/30 rounded">
      {releases.length === 0 ? (
        <div className="text-white p-4">{t('availability.no_releases')}.</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0A0A0A]">
              <th className="px-4 py-3 text-center w-1/4 text-white text-sm font-medium">
                {t('releaseName')}
              </th>
              <th className="px-4 py-3 text-center w-1/4 text-white text-sm font-medium">
                {t('artist')}
              </th>
              <th className="px-4 py-3 text-center w-1/4 text-white text-sm font-medium">
                {t('releaseDate')}
              </th>
              <th className="px-4 py-3 text-center w-1/4 text-metallic-gray text-sm font-medium">
                {t('action')}
              </th>
            </tr>
          </thead>
          <tbody>
            {releases.map((release) => (
              <tr key={release.id} className="border-t border-t-metallic-gray/30">
                <td className="px-4 py-3 w-1/4 text-white text-sm">
                  {release.title}
                </td>
                <td className="px-4 py-3 text-metallic-gray text-sm">
                  {release.artists.map((artist: Artist, index: number) => (
                    <span key={artist.id}>
                      {artist.artist_name}
                      {index < release.artists.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </td>
                <td className="px-4 py-3 w-1/4 text-white text-sm">
                  {formatReleaseDate(release.release_date)}
                </td>
                <td className="px-4 py-3 w-1/4 text-center">
                  <button
                    className="text-xl mx-2 text-metallic-gray hover:text-white"
                    onClick={() => onEdit(release)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="text-gray-400 hover:text-white text-xl mx-2"
                    onClick={() => onDelete(release.id)}
                    type="button"
                    aria-label="Delete"
                    title="delete"
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

export default ReleasesTable;
