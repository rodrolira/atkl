// components/ReleaseLinks.tsx
import React, { useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBandcamp,
  faSpotify,
  faApple,
  faYoutube,
  faSoundcloud,
} from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Release } from '@/types/interfaces/Release';


// Define the props for the component
interface ReleaseLinksProps {
  release: Release | null;
}

const defaultRelease: Release = {} as Release;

const ReleaseLinks: React.FC<ReleaseLinksProps> = ({ release = defaultRelease }) => {
  if (!release) {
    return null;
  } // or return a default value, e.g. <div>No release data</div>

  const bandcampIcon = useMemo(() => <FontAwesomeIcon icon={faBandcamp} />, [faBandcamp]);
  const spotifyIcon = useMemo(() => <FontAwesomeIcon icon={faSpotify} />, [faSpotify]);
  const appleMusicIcon = useMemo(() => <FontAwesomeIcon icon={faApple} />, [faApple]);
  const youtubeIcon = useMemo(() => <FontAwesomeIcon icon={faYoutube} />, [faYoutube]);
  const soundcloudIcon = useMemo(() => <FontAwesomeIcon icon={faSoundcloud} />, [faSoundcloud]);
  const beatportIcon = useMemo(() => <Icon icon="simple-icons:beatport" />, ["simple-icons:beatport"]);

  return (
    <div className="flex flex-wrap space-x-2 text-2xl items-center justify-center p-2">
      {release.bandcamp_link && (
        <Link
          to={release.bandcamp_link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View on Bandcamp"
          className="text-gray-400 hover:text-teal-600"
        >
          {bandcampIcon}
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
          {spotifyIcon}
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
          {appleMusicIcon}
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
          {youtubeIcon}
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
          {soundcloudIcon}
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
          {beatportIcon}
        </Link>
      )}
    </div>
  );
};

export default React.memo(ReleaseLinks);
