declare module '@madzadev/audio-player' {
  interface PlayerProps {
    trackList: Array<{
      url: string;
      title: string;
      tags?: string[];
    }>;
    includeTags?: boolean;
    includeSearch?: boolean;
    showPlaylist?: boolean;
    sortTracks?: boolean;
    autoPlayNextTrack?: boolean;
  }

  const Player: React.FC<PlayerProps>;
  export default Player;
} 