import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const ReleasesTable = ({ releases, onEdit, onDelete }) => (
  <div className="w-full overflow-x-auto border border-[#2e7728] rounded">
    {releases.length === 0 ? (
      <div className="text-white p-4">No releases available.</div>
    ) : (
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#194116]">
            <th className="px-4 py-3 text-center w-1/4 text-white text-sm font-medium">
              Release Name
            </th>
            <th className="px-4 py-3 text-center w-1/4 text-white text-sm font-medium">
              Artist
            </th>
            <th className="px-4 py-3 text-center w-1/4 text-white text-sm font-medium">
              Release Date
            </th>
            <th className="px-4 py-3 text-center w-1/4 text-[#8bd685] text-sm font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {releases.map((release) => (
            <tr key={release.id} className="border-t border-t-[#2e7728]">
              <td className="px-4 py-3 w-1/4 text-white text-sm">
                {release.title}
              </td>
              <td className="px-4 py-3 text-[#8bd685] text-sm">
                {release.artists.map((artist, index) => (
                  <span key={artist.id}>
                    {artist.artist_name}
                    {index < release.artists.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </td>
              <td className="px-4 py-3 w-1/4 text-white text-sm">
                {release.release_date}
              </td>
              <td className="px-4 py-3 w-1/4 text-center">
                <button
                  className="text-xl mx-2 text-yellow-400 hover:text-yellow-500"
                  onClick={() => onEdit(release)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => onDelete(release.id)}
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

export default ReleasesTable;
