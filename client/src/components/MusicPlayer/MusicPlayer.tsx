import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faVolumeUp, faVolumeMute, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';

const MusicPlayer: React.FC = () => {
  const { trackList, isVisible, setIsVisible, isPlaying, setIsPlaying, currentTrackUrl } = useMusicPlayer();
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = trackList[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackUrl]);


  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value));
  };

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = Number(event.target.value);
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const updateProgress = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleTrackEnd = () => {
    if (currentTrackIndex < trackList.length - 1) {
      setCurrentTrackIndex((prev) => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  if (!isVisible || trackList.length === 0) return null;

  return (
    <div className="fixed audio-player bottom-0 left-0 w-full text-white shadow-lg flex items-center p-4 z-50">
      <audio
        ref={audioRef}
        src={currentTrack?.url}
        onTimeUpdate={updateProgress}
        onEnded={handleTrackEnd}
        autoPlay
      />
      
      <button onClick={() => setIsPlaying(!isPlaying)} className="text-2xl mx-4">
        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
      </button>

      <div className="flex flex-col flex-grow">
      <p className="font-bold">{trackList[0]?.title}</p>
      <input
          type="range"
          value={progress}
          max={audioRef.current?.duration || 100}
          onChange={handleProgressChange}
          className="w-full"
        />
      </div>

      <div className="flex items-center mx-4">
        <FontAwesomeIcon icon={volume > 0 ? faVolumeUp : faVolumeMute} className="mr-2" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-24"
        />
      </div>

      <button onClick={() => setIsVisible(false)} className="text-purple-500 text-2xl ml-4">
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

export default MusicPlayer;
