import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  faInstagram,
  faFacebook,
  faSoundcloud,
  faBandcamp,
  faYoutube,
  faSpotify,
} from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Artist } from '@/types/interfaces/Artist';

interface ArtistLinksProps {
  artist: Artist
}

const ArtistLinks: React.FC<ArtistLinksProps> = ({ artist }) => (
  <div className="flex flex-wrap space-x-2 text-2xl items-center justify-center py-2">
    {artist.twitter_link && (
      <Link
        to={artist.twitter_link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View Twitter Profile"
        className="text-gray-400 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300"
      
      >
        <FontAwesomeIcon icon={faTwitter} />
      </Link>
    )}
    {artist.instagram_link && (
      <Link
        to={artist.instagram_link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View Instagram Profile"
        className="text-gray-400 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-300"
      >
        <FontAwesomeIcon icon={faInstagram} />
      </Link>
    )}
    {artist.facebook_link && (
      <Link
        to={artist.facebook_link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View Facebook Profile"
        className="text-gray-400 dark:text-gray-400 hover:text-blue-800 dark:hover:text-blue-600"
      >
        <FontAwesomeIcon icon={faFacebook} />
      </Link>
    )}
    {artist.soundcloud_link && (
      <Link
        to={artist.soundcloud_link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View SoundCloud Profile"
        className="text-gray-400 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
      >
        <FontAwesomeIcon icon={faSoundcloud} />
      </Link>
    )}
    {artist.bandcamp_link && (
      <Link
        to={artist.bandcamp_link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View Bandcamp Profile"
        className="text-gray-400 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-500"
      >
        <FontAwesomeIcon icon={faBandcamp} />
      </Link>
    )}
    {artist.youtube_link && (
      <Link
        to={artist.youtube_link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View YouTube Profile"
        className="text-gray-400 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
      >
        <FontAwesomeIcon icon={faYoutube} />
      </Link>
    )}
    {artist.spotify_link && (
      <Link
        to={artist.spotify_link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View Spotify Profile"
        className="text-gray-400 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
      >
        <FontAwesomeIcon icon={faSpotify} />
      </Link>
    )}
    {artist.beatport_link && (
      <Link
        to={artist.beatport_link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View Beatport Profile"
        className="flex items-center justify-center"
      >
        <Icon
          icon="simple-icons:beatport"
          width="1em"
          height="1em"
          className="text-gray-400 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
        />
      </Link>
    )}
  </div>
);

export default ArtistLinks;
