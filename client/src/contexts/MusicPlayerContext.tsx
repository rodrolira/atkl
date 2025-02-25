import React, { createContext, useContext, useState } from 'react';
import { Track } from '@/types/interfaces/Track';
import { boolean } from 'yup';

interface MusicPlayerContextProps {
  trackList: Track[];
  setTrackList: (tracks: Track[]) => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTrackUrl: string | null;
  setCurrentTrackUrl: (url: string | null) => void;
  playRelease: (tracks: Track[], isSingle: boolean) => void;
  isSingle: boolean;
  setIsSingle: (isSingle: boolean) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextProps | undefined>(undefined);

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trackList, setTrackList] = useState<Track[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrackUrl, setCurrentTrackUrl] = useState<string | null>(null);
  const [isSingle, setIsSingle] = useState<boolean>(false);

  // 🔹 Reproducir un release completo
  const playRelease = (tracks: Track[], isSingle: boolean) => {
    if (tracks.length === 0) return;

    setTrackList(tracks);
    setCurrentTrackUrl(tracks[0].audioUrl);
    setIsVisible(true);
    setIsPlaying(true);
    setIsSingle(isSingle); // Ensure isSingle is set correctly
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        trackList,
        setTrackList,
        isVisible,
        setIsVisible,
        isPlaying,
        setIsPlaying,
        currentTrackUrl,
        setCurrentTrackUrl,
        playRelease,
        isSingle,
        setIsSingle
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
};
