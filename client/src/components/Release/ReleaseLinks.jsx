// components/ReleaseLinks.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBandcamp,
  faSpotify,
  faApple,
  faYoutube,
  faSoundcloud,
} from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { Icon } from '@iconify/react';

const ReleaseLinks = ({ release }) => (
  <div className="flex flex-wrap space-x-2 text-2xl items-center justify-center p-2">
    {release.bandcamp_link && (
      <Link
        to={release.bandcamp_link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View on Bandcamp"
        className="text-gray-400 hover:text-teal-600"
      >
        <FontAwesomeIcon icon={faBandcamp} />
      </Link>
    )}
    {release.spotify_link && (
      <Link
        to={release.spotify_link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View on Spotify"
        className="text-gray-400 hover:text-green-400"
      >
        <FontAwesomeIcon icon={faSpotify} />
      </Link>
    )}
    {release.apple_music_link && (
      <Link
        to={release.apple_music_link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View on Apple Music"
        className="text-gray-400 hover:text-purple-500"
      >
        <FontAwesomeIcon icon={faApple} />
      </Link>
    )}
    {release.youtube_link && (
      <Link
        to={release.youtube_link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View on YouTube"
        className="text-gray-400 hover:text-red-500"
      >
        <FontAwesomeIcon icon={faYoutube} />
      </Link>
    )}
    {release.soundcloud_link && (
      <Link
        to={release.soundcloud_link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View on SoundCloud"
        className="text-gray-400 hover:text-orange-500"
      >
        <FontAwesomeIcon icon={faSoundcloud} />
      </Link>
    )}
    {release.beatport_link && (
      <Link
        to={release.beatport_link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View on Beatport"
        className="text-gray-400 hover:text-green-500"
      >
        <Icon icon="simple-icons:beatport" />
      </Link>
    )}
  </div>
);

ReleaseLinks.propTypes = {
  release: PropTypes.shape({
    bandcamp_link: PropTypes.string,
    spotify_link: PropTypes.string,
    apple_music_link: PropTypes.string,
    youtube_link: PropTypes.string,
    soundcloud_link: PropTypes.string,
    beatport_link: PropTypes.string,
  }).isRequired,
};

export default ReleaseLinks;
