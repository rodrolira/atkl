import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faSoundcloud,
  faBandcamp,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';

const SocialMediaIcons: React.FC = React.memo(() => (
  <div className="flex gap-4 text-white sm:justify-center z-10 px-4">
    <Link
      to="https://www.instagram.com/atkl.records/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label='View on Instagram'
    >
      <i>
        <FontAwesomeIcon icon={faInstagram} size="2x" />
      </i>
    </Link>
    <Link
      to="https://soundcloud.com/atkl.records"
      target="_blank"
      rel="noopener noreferrer"
      aria-label='View on Soundcloud'
    >
      <i>
        <FontAwesomeIcon icon={faSoundcloud} size="2x" />
      </i>
    </Link>
    <Link
      to="https://www.bandcamp.com/atkl.records"
      target="_blank"
      rel="noopener noreferrer"
      aria-label='View on Bandcamp'
    >
      <i>
        <FontAwesomeIcon icon={faBandcamp} size="2x" />
      </i>
    </Link>
    <Link
      to="https://www.youtube.com/channel/UC-9-kyTW8ZkZNDHQyHvryaw"
      target="_blank"
      rel="noopener noreferrer"
      aria-label='View on YouTube'
    >
      <i>
        <FontAwesomeIcon icon={faYoutube} size="2x" />
      </i>
    </Link>
  </div>
));

export default SocialMediaIcons;
