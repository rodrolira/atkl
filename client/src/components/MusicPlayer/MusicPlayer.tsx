import React, { useState, useEffect } from 'react';

interface MusicPlayerProps {
  audioSrc: string;
  onClose: () => void;
  duration?: number; // Duración predeterminada en segundos
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ audioSrc, onClose, duration = 30 }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsPlaying(false);
            audioRef.current?.pause();
            onClose();
            return duration;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, duration, onClose]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 z-50 flex justify-between items-center">
      <audio ref={audioRef} src={audioSrc} preload="auto" />
      <button onClick={onClose} className="text-red-500 font-bold">Close</button>
      <button onClick={handlePlayPause} className="bg-purple-500 px-4 py-2 rounded">
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <span>{timeLeft}s remaining</span>
    </div>
  );
};

export default MusicPlayer;
