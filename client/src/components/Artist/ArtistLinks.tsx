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
        className="text-gray-400 hover:text-white"
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
        className="text-gray-400 hover:text-white"
      />
    ),
    []
  );

  const socialLink = (icon: React.ReactNode, className: string) => (
    <Link className={className}>
      {icon}
    </Link>
  );

  return (
    <div className="flex flex-wrap space-x-2 text-2xl items-center justify-center py-2 z-10 relative">
      {artist.twitter_link && socialLink(memoizedTwitterIcon, "text-gray-400 hover:text-white")}
      {artist.instagram_link && socialLink(memoizedInstagramIcon, "text-gray-400 hover:text-white")}
      {artist.facebook_link && socialLink(memoizedFacebookIcon, "text-gray-400 hover:text-white")}
      {artist.soundcloud_link && socialLink(memoizedSoundcloudIcon, "text-gray-400 hover:text-white")}
      {artist.bandcamp_link && socialLink(memoizedBandcampIcon, "text-gray-400 hover:text-white")}
      {artist.youtube_link && socialLink(memoizedYoutubeIcon, "text-gray-400 hover:text-white")}
      {artist.spotify_link && socialLink(memoizedSpotifyIcon, "text-gray-400 hover:text-white")}
      {artist.apple_music_link && socialLink(memoizedAppleMusicIcon, "text-gray-400 hover:text-white")}
      {artist.beatport_link && socialLink(memoizedBeatportIcon, "text-gray-400 hover:text-white")}
    </div>
  );
});

export default React.memo(ArtistLinks);
