import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faVolumeUp, faVolumeMute, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import './MusicPlayer.css';  

const MusicPlayer: React.FC = () => {
  const { trackList, isVisible, setIsVisible, isPlaying, setIsPlaying, currentTrackUrl } = useMusicPlayer();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);


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
      setProgress(percentage);
      document.documentElement.style.setProperty('--progress-width', `${percentage}%`);
    }
  };

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = (Number(event.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(Number(event.target.value));
    }
  };

  if (!isVisible || trackList.length === 0) return null;

  return (
    <div className="music-player">
      <audio 
        ref={audioRef} 
        src={currentTrackUrl || ''} 
        onTimeUpdate={updateProgress} 
        autoPlay 
      />

      {/* Botón de Play/Pause */}
      <button onClick={() => setIsPlaying(!isPlaying)} className="play-button">
        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
      </button>

      {/* Información de la pista */}
      <div className="track-info">
        <p className="track-title">{trackList[0]?.title}</p>

        {/* Barra de progreso con ancho casi completo */}
        <input
          type="range"
          value={progress}
          max="100"
          onChange={handleProgressChange}
          className="progress-bar"
          style={{ background: `linear-gradient(to right, #4CAF50 ${progress}%, #444 ${progress}%)` }}

        />
      </div>

      {/* Control de volumen */}
      <div className="volume-control">
        <FontAwesomeIcon icon={volume > 0 ? faVolumeUp : faVolumeMute} className="volume-icon" />
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

      {/* Botón para cerrar el reproductor */}
      <button onClick={() => setIsVisible(false)} className="close-button">
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

export default MusicPlayer;
