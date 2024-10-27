import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInstagram,
  faSoundcloud,
  faBandcamp,
} from '@fortawesome/free-brands-svg-icons';
import { Icon } from '@iconify/react';

const SocialMediaIcons: React.FC = () => (
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
        <Icon
          icon="simple-icons:beatport"
          width="2em"
          height="2em"
          style={{ color: 'white' }}
        />
      </i>
    </Link>
  </div>
);

export default SocialMediaIcons;
