import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faPause,
  faStepBackward,
  faStepForward,
  faVolumeUp,
  faVolumeDown,
  faVolumeMute,
  faTimes,
  faExpand,
  faCompress,
} from '@fortawesome/free-solid-svg-icons';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import './MusicPlayer.css';

interface MusicPlayerProps {
  /** Permite cambiar entre modo compacto y expandido */
  compact?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ compact = false }) => {
  const {
    trackList,
    isVisible,
    setIsVisible,
    isPlaying,
    setIsPlaying,
    currentTrackUrl,
    setCurrentTrackUrl,
    isSingle,
    setIsSingle,
  } = useMusicPlayer();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>('0:00');
  const [duration, setDuration] = useState<string>('0:00');
  const [volume, setVolume] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [previousVolume, setPreviousVolume] = useState<number>(1);

  const currentTrack = trackList[currentIndex] || null;

  // Sincronizar reproducción con el estado
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackUrl]);

  // Sincronizar volumen
  useEffect(() => {
    if (audioRef.current) {
      const effectiveVolume = isMuted ? 0 : volume;
      audioRef.current.volume = effectiveVolume;
    }
  }, [volume, isMuted]);

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const updateProgress = () => {
    if (audioRef.current) {
      const percentage =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(isNaN(percentage) ? 0 : percentage);
      setCurrentTime(formatTime(audioRef.current.currentTime));
      setDuration(formatTime(audioRef.current.duration));
    }
  };

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = (Number(event.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(Number(event.target.value));
    }
  };

  const handleNext = () => {
    if (!isSingle && currentIndex < trackList.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentTrackUrl(trackList[nextIndex].audioUrl);
      setCurrentIndex(nextIndex);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (!isSingle && currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentTrackUrl(trackList[prevIndex].audioUrl);
      setCurrentIndex(prevIndex);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(event.target.value);
    setVolume(newVolume);
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
      setPreviousVolume(newVolume);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(previousVolume > 0 ? previousVolume : 1);
    } else {
      setIsMuted(true);
      setPreviousVolume(volume);
      setVolume(0);
    }
  };

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClose = () => {
    setIsVisible(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  if (!isVisible || trackList.length === 0) return null;

  const effectiveVolume = isMuted ? 0 : volume;
  const volumeIcon = effectiveVolume === 0 ? faVolumeMute : effectiveVolume < 0.5 ? faVolumeDown : faVolumeUp;

  return (
    <div className={`music-player ${compact ? 'compact' : ''}`}>
      <audio
        ref={audioRef}
        src={currentTrackUrl || ''}
        onTimeUpdate={updateProgress}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(formatTime(audioRef.current.duration));
          }
        }}
        autoPlay
      />

      {/* Portada / artwork */}
      <div className="player-cover">
        <div className="cover-art">
          <div className="cover-placeholder">
            <FontAwesomeIcon icon={faExpand} className="cover-icon" />
          </div>
        </div>
        {compact && (
          <button
            className="expand-button"
            onClick={handleToggleExpanded}
            aria-label={isExpanded ? 'Compact view' : 'Expanded view'}
          >
            <FontAwesomeIcon icon={isExpanded ? faCompress : faExpand} />
          </button>
        )}
      </div>

      {/* Información de la pista */}
      <div className="player-info">
        <div className="track-title">
          {currentTrack?.title || 'Pista desconocida'}
        </div>
        <div className="track-subtitle">
          {trackList.length > 1
            ? `${currentIndex + 1} de ${trackList.length}`
            : isSingle ? 'Single' : ''}
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="player-progress">
        <div className="progress-time">
          <span className="time-current">{currentTime}</span>
          <span className="time-duration">- {duration}</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={isNaN(progress) ? 0 : progress}
          onChange={handleProgressChange}
          className="progress-slider"
        />
      </div>

      {/* Controles de reproducción */}
      <div className="player-controls">
        {!isSingle && (
          <button
            className="control-button prev-button"
            onClick={handlePrev}
            disabled={currentIndex === 0 || isSingle}
            aria-label="Anterior"
          >
            <FontAwesomeIcon icon={faStepBackward} />
          </button>
        )}
        <button
          className={`control-button play-button ${isPlaying ? 'playing' : ''}`}
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </button>
        {!isSingle && (
          <button
            className="control-button next-button"
            onClick={handleNext}
            disabled={currentIndex >= trackList.length - 1 || isSingle}
            aria-label="Siguiente"
          >
            <FontAwesomeIcon icon={faStepForward} />
          </button>
        )}
      </div>

      {/* Control de volumen */}
      <div className="player-volume">
        <button
          className="volume-button"
          onClick={toggleMute}
          aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
        >
          <FontAwesomeIcon icon={volumeIcon} />
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={effectiveVolume}
          onChange={handleVolumeChange}
          className="volume-slider"
        />
      </div>

      {/* Botón cerrar */}
      <button
        className="close-button"
        onClick={handleClose}
        aria-label="Cerrar reproductor"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>

      {/* Tracklist expandible */}
      {!isSingle && (
        <div className={`tracklist-panel ${isExpanded ? 'expanded' : ''}`}>
          <button
            className="tracklist-toggle"
            onClick={handleToggleExpanded}
            aria-label={isExpanded ? 'Ocultar lista' : 'Mostrar lista'}
          >
            {isExpanded ? '▲' : '▼'}
            <span>{trackList.length} pistas</span>
          </button>
          {isExpanded && (
            <ul className="tracklist">
              {trackList.map((track, index) => (
                <li
                  key={track.id}
                  className={`track-item ${
                    index === currentIndex ? 'current-track' : ''
                  }`}
                  onClick={() => {
                    setCurrentTrackUrl(track.audioUrl);
                    setCurrentIndex(index);
                    setIsPlaying(true);
                    setIsExpanded(false);
                  }}
                >
                  <span className="track-number">
                    {index === currentIndex ? '▶' : index + 1}
                  </span>
                  <span className="track-title">{track.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(MusicPlayer);
