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
      className="inline-flex min-h-11 min-w-11 items-center justify-center text-muted transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
      className="inline-flex min-h-11 min-w-11 items-center justify-center text-muted transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <i>
        <FontAwesomeIcon icon={faSoundcloud} size="2x" />
      </i>
    </Link>
    <Link
      to="https://atklrecords.bandcamp.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label='View on Bandcamp'
      className="inline-flex min-h-11 min-w-11 items-center justify-center text-muted transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
      className="inline-flex min-h-11 min-w-11 items-center justify-center text-muted transition-colors hover:text-accent focus-visible:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <i>
        <FontAwesomeIcon icon={faYoutube} size="2x" />
      </i>
    </Link>
  </div>
));

export default SocialMediaIcons;
