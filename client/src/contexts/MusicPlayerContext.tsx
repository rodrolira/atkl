import React, { createContext, useContext, useState } from 'react';

interface MusicPlayerContextProps {
  audioUrl: string | null;
  setAudioUrl: (url: string | null) => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextProps | undefined>(undefined);

export const MusicPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  return (
    <MusicPlayerContext.Provider value={{ audioUrl, setAudioUrl, isVisible, setIsVisible }}>
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
