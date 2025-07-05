import React, { useState, useRef, useEffect } from "react";
import { Track } from '@/types/interfaces/Track';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faMusic } from '@fortawesome/free-solid-svg-icons';

interface TrackListProps {
  tracks: Track[];
  currentTrackUrl: string | null;
  setCurrentTrackUrl: (url: string | null) => void;
  currentTrackIndex: number;
  setCurrentIndex: (index: number) => void;
}

const TrackList: React.FC<TrackListProps> = ({ 
  tracks, 
  currentTrackUrl, 
  setCurrentTrackUrl,
  currentTrackIndex,
  setCurrentIndex
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentTrack = tracks[currentTrackIndex] || null;

  return (
    <div className={`dropdown-playlist ${isExpanded ? 'expanded' : ''}`} ref={dropdownRef}>
      <div className="dropdown-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="current-track-info">
          <FontAwesomeIcon icon={faMusic} className="music-icon" />
          <span className="track-number">{currentTrackIndex + 1}</span>
          <span className="track-title">{currentTrack?.title || 'Seleccionar pista'}</span>
        </div>
        <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} className="dropdown-icon"/>
      </div>
      
      {isExpanded && (
        <div className="track-list-container">
          <ul className="track-list">
            {tracks.map((track, index) => (
              <li 
                key={track.id} 
                onClick={() => {
                  setCurrentTrackUrl(track.audioUrl);
                  setCurrentIndex(index);
                  setIsExpanded(false);
                }}
                className={`track-item ${index === currentTrackIndex ? 'current-track' : ''}`}
              >
                <span className="track-number">
                  {index === currentTrackIndex ? '▶' : index + 1}
                </span>
                <span className="track-title">{track.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TrackList;