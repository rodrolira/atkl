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


interface ReleaseLinksProps {
  release: Release | null;
}

const defaultRelease: Release = {} as Release;

const ReleaseLinks: React.FC<ReleaseLinksProps> = ({ release = defaultRelease }) => {
  if (!release) {
    return null;
  }

  const bandcampIcon = useMemo(() => <FontAwesomeIcon icon={faBandcamp} />, [faBandcamp]);
  const spotifyIcon = useMemo(() => <FontAwesomeIcon icon={faSpotify} />, [faSpotify]);
  const appleMusicIcon = useMemo(() => <FontAwesomeIcon icon={faApple} />, [faApple]);
  const youtubeIcon = useMemo(() => <FontAwesomeIcon icon={faYoutube} />, [faYoutube]);
  const soundcloudIcon = useMemo(() => <FontAwesomeIcon icon={faSoundcloud} />, [faSoundcloud]);
  const beatportIcon = useMemo(() => <Icon icon="simple-icons:beatport" />, ["simple-icons:beatport"]);

  const socialLink = (icon: React.ReactNode, className: string) => (
    <Link className={className}>
      {icon}
    </Link>
  );

  return (
    <div className="flex flex-wrap space-x-2 text-2xl items-center justify-center p-2">
      {release.bandcamp_link && socialLink(bandcampIcon, "text-gray-400 hover:text-white")}
      {release.spotify_link && socialLink(spotifyIcon, "text-gray-400 hover:text-white")}
      {release.apple_music_link && socialLink(appleMusicIcon, "text-gray-400 hover:text-white")}
      {release.youtube_link && socialLink(youtubeIcon, "text-gray-400 hover:text-white")}
      {release.soundcloud_link && socialLink(soundcloudIcon, "text-gray-400 hover:text-white")}
      {release.beatport_link && socialLink(beatportIcon, "text-gray-400 hover:text-white")}
    </div>
  );
};

export default React.memo(ReleaseLinks);
