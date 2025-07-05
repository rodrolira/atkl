import { Track } from "./Track";

interface MusicPlayerState {
    trackList: Track[];
    currentTrackIndex: number;
    isPlaying: boolean;
    isVisible: boolean;
    isSingle: boolean;
    volume: number;
    progress: number;
    duration: number;
  }