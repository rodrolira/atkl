import React, { createContext, useContext, useState } from 'react';

interface Track {
  url: string;
  title: string;
  tags?: string[];
}

interface MusicPlayerContextProps {
  trackList: Track[];
  setTrackList: (tracks: Track[]) => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTrackUrl: string | null;
  setCurrentTrackUrl: (url: string | null) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextProps | undefined>(undefined);

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trackList, setTrackList] = useState<Track[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrackUrl, setCurrentTrackUrl] = useState<string | null>(null);

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
