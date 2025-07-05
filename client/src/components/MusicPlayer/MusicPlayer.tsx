import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStepBackward, faStepForward, faVolumeUp, faVolumeMute, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import './MusicPlayer.css';
import TrackList from './TrackList';

const MusicPlayer: React.FC = () => {
  const { trackList, isVisible, setIsVisible, isPlaying, setIsPlaying, currentTrackUrl, setCurrentTrackUrl, isSingle } = useMusicPlayer();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const updateProgress = () => {
    if (audioRef.current) {
      const percentage = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(isNaN(percentage) ? 0 : percentage);
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

  if (!isVisible || trackList.length === 0) return null;

  return (
    <div className="music-player">
      <audio ref={audioRef} src={currentTrackUrl || ''} onTimeUpdate={updateProgress} autoPlay />

      {/* Controles de reproducción */}
      <div className="controls">
        {!isSingle && (
          <button onClick={handlePrev} className="control-button">
            <FontAwesomeIcon icon={faStepBackward} size='2xl' />
          </button>
        )}
        <button onClick={() => setIsPlaying(!isPlaying)} className="control-button">
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} size='2xl'  />
        </button>
        {!isSingle && (
          <button onClick={handleNext} className="control-button">
            <FontAwesomeIcon icon={faStepForward} size='2xl' />
          </button>
        )}
      </div>

      {/* Información de la pista */}
      <div className="track-info">
        <p className="track-title">{trackList[currentIndex]?.title}</p>
        <input
          type="range"
          value={isNaN(progress) ? 0 : progress}
          max="100"
          onChange={handleProgressChange}
          className="progress-bar"
        />
      </div>

     

      {/* Lista de reproducción si NO es un single */}
      {!isSingle && 
      <TrackList
       tracks={trackList} 
       currentTrackUrl={currentTrackUrl} 
       setCurrentTrackUrl={setCurrentTrackUrl} 
       currentTrackIndex={currentIndex}
       setCurrentIndex={setCurrentIndex}
       />}

      {/* Botón para cerrar */}
      <button onClick={() => setIsVisible(false)} className="close-button">
        <FontAwesomeIcon icon={faTimes} className="icon close-icon" />
      </button>
       {/* Control de volumen */}
       <div className="volume-control">
        <FontAwesomeIcon icon={volume > 0 ? faVolumeUp : faVolumeMute} className="icon volume-icon" />
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume} 
          onChange={(e) => setVolume(Number(e.target.value))} 
          className="volume-slider"
        />
      </div>
    </div>
  );
};

export default MusicPlayer;