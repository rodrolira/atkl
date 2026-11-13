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
import { Icon } from '@iconify/react';
import { Artist } from '@/types/interfaces/Artist';
import { safeExternalUrl } from '@/utils/utils';

interface ArtistLinksProps {
  artist: Artist;
}

const ArtistLinks: React.FC<ArtistLinksProps> = ({ artist }) => {
  const links = [
    { url: artist.twitter_link, label: 'Twitter', icon: <FontAwesomeIcon icon={faTwitter} /> },
    { url: artist.instagram_link, label: 'Instagram', icon: <FontAwesomeIcon icon={faInstagram} /> },
    { url: artist.facebook_link, label: 'Facebook', icon: <FontAwesomeIcon icon={faFacebook} /> },
    { url: artist.soundcloud_link, label: 'SoundCloud', icon: <FontAwesomeIcon icon={faSoundcloud} /> },
    { url: artist.bandcamp_link, label: 'Bandcamp', icon: <FontAwesomeIcon icon={faBandcamp} /> },
    { url: artist.youtube_link, label: 'YouTube', icon: <FontAwesomeIcon icon={faYoutube} /> },
    { url: artist.spotify_link, label: 'Spotify', icon: <FontAwesomeIcon icon={faSpotify} /> },
    {
      url: artist.apple_music_link,
      label: 'Apple Music',
      icon: <Icon icon="simple-icons:applemusic" width="1em" height="1em" />,
    },
    {
      url: artist.beatport_link,
      label: 'Beatport',
      icon: <Icon icon="simple-icons:beatport" width="1em" height="1em" />,
    },
  ];

  const visible = links
    .map((link) => ({ ...link, url: safeExternalUrl(link.url) }))
    .filter((link) => link.url);

  if (visible.length === 0) return null;

  return (
    <div className="flex flex-wrap space-x-2 text-2xl items-center justify-center py-2 z-10 relative">
      {visible.map((link) => (
        <a
          key={link.label}
          href={link.url as string}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${artist.artist_name} — ${link.label}`}
          title={link.label}
          className="text-gray-400 hover:text-white focus-visible:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
};

export default React.memo(ArtistLinks);
