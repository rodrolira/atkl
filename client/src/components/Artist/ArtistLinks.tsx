import React, { useMemo } from 'react';
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

const ArtistLinks: React.FC<ArtistLinksProps> = React.memo(({ artist }) => {
  const memoizedFaTwitter = useMemo(() => faTwitter, [faTwitter]);
  const memoizedFaInstagram = useMemo(() => faInstagram, [faInstagram]);
  const memoizedFaFacebook = useMemo(() => faFacebook, [faFacebook]);
  const memoizedFaSoundcloud = useMemo(() => faSoundcloud, [faSoundcloud]);
  const memoizedFaBandcamp = useMemo(() => faBandcamp, [faBandcamp]);
  const memoizedFaYoutube = useMemo(() => faYoutube, [faYoutube]);
  const memoizedFaSpotify = useMemo(() => faSpotify, [faSpotify]);

  const memoizedTwitterIcon = useMemo(
    () => <FontAwesomeIcon icon={memoizedFaTwitter} />,
    [memoizedFaTwitter]
  );
  
  const memoizedInstagramIcon = useMemo(
    () => <FontAwesomeIcon icon={memoizedFaInstagram} />,
    [memoizedFaInstagram]
  );
  
  const memoizedFacebookIcon = useMemo(
    () => <FontAwesomeIcon icon={memoizedFaFacebook} />,
    [memoizedFaFacebook]
  );
  
  const memoizedSoundcloudIcon = useMemo(
    () => <FontAwesomeIcon icon={memoizedFaSoundcloud} />,
    [memoizedFaSoundcloud]
  );
  
  const memoizedBandcampIcon = useMemo(
    () => <FontAwesomeIcon icon={memoizedFaBandcamp} />,
    [memoizedFaBandcamp]
  );
  
  const memoizedYoutubeIcon = useMemo(
    () => <FontAwesomeIcon icon={memoizedFaYoutube} />,
    [memoizedFaYoutube]
  );
  
  const memoizedSpotifyIcon = useMemo(
    () => <FontAwesomeIcon icon={memoizedFaSpotify} />,
    [memoizedFaSpotify]
  );

  const memoizedAppleMusicIcon = useMemo(
    () => (
      <Icon
        icon="simple-icons:applemusic"
        width="1em"
        height="1em"
        className="text-gray-400 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
      />
    ),
    []
  );

  const memoizedBeatportIcon = useMemo(
    () => (
      <Icon
        icon="simple-icons:beatport"
        width="1em"
        height="1em"
        className="text-gray-400 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
      />
    ),
    []
  );

  return (
    <div className="flex flex-wrap space-x-2 text-2xl items-center justify-center py-2 z-10 relative">
      {artist.twitter_link && (
        <Link
          to={artist.twitter_link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Twitter Profile"
          className="text-gray-400 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300"
        >
          {memoizedTwitterIcon}
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
          {memoizedInstagramIcon}
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
          {memoizedFacebookIcon}
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
          {memoizedSoundcloudIcon}
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
          {memoizedBandcampIcon}
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
          {memoizedYoutubeIcon}
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
          {memoizedSpotifyIcon}
        </Link>
      )}
      {artist.apple_music_link && (
        <Link
          to={artist.apple_music_link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Apple Music Profile"
          className="flex items-center justify-center"
        >
          {memoizedAppleMusicIcon}
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
          {memoizedBeatportIcon}
        </Link>
      )}
    </div>
  );
});

export default ArtistLinks;
