import React, { useEffect, useRef } from 'react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';

const MusicPlayer: React.FC = () => {
  const { audioUrl, isVisible, setIsVisible } = useMusicPlayer();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
    }
  }, [audioUrl]);

  if (!isVisible || !audioUrl) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 p-4 text-white shadow-lg flex items-center justify-center z-50">
      <audio ref={audioRef} controls autoPlay className="w-full max-w-3xl">
        <source src={audioUrl} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <button
        onClick={() => setIsVisible(false)}
        className="ml-4 text-red-500 text-lg font-bold"
      >
        ✖
      </button>
    </div>
  );
};

export default MusicPlayer;
