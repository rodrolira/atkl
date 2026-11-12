// components/ReleaseLinks.tsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBandcamp,
  faSpotify,
  faApple,
  faYoutube,
  faSoundcloud,
} from '@fortawesome/free-brands-svg-icons';
import { Icon } from '@iconify/react';
import { Release } from '@/types/interfaces/Release';
import { safeExternalUrl } from '@/utils/utils';

interface ReleaseLinksProps {
  release: Release | null;
}

const ReleaseLinks: React.FC<ReleaseLinksProps> = ({ release }) => {
  if (!release) return null;

  const links = [
    { url: release.bandcamp_link, label: 'Bandcamp', icon: <FontAwesomeIcon icon={faBandcamp} /> },
    { url: release.spotify_link, label: 'Spotify', icon: <FontAwesomeIcon icon={faSpotify} /> },
    { url: release.apple_music_link, label: 'Apple Music', icon: <FontAwesomeIcon icon={faApple} /> },
    { url: release.youtube_link, label: 'YouTube', icon: <FontAwesomeIcon icon={faYoutube} /> },
    { url: release.soundcloud_link, label: 'SoundCloud', icon: <FontAwesomeIcon icon={faSoundcloud} /> },
    { url: release.beatport_link, label: 'Beatport', icon: <Icon icon="simple-icons:beatport" /> },
  ];

  const visible = links
    .map((link) => ({ ...link, url: safeExternalUrl(link.url) }))
    .filter((link) => link.url);

  if (visible.length === 0) return null;

  return (
    <div className="flex flex-wrap space-x-2 text-2xl items-center justify-center p-2">
      {visible.map((link) => (
        <a
          key={link.label}
          href={link.url as string}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${release.title ?? ''} — ${link.label}`}
          title={link.label}
          className="text-gray-400 hover:text-white focus-visible:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
};

export default React.memo(ReleaseLinks);
