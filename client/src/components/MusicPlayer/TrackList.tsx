import React from "react";
import { Track } from '@/types/interfaces/Track';

interface TrackListProps {
  tracks: Track[];
  currentTrackUrl: string | null;
  setCurrentTrackUrl: (url: string | null) => void;
}

const TrackList: React.FC<TrackListProps> = ({ tracks, currentTrackUrl, setCurrentTrackUrl }) => {
  return (
    <div className="playlist">
      <h3>Lista de reproducción</h3>
      <ul>
        {tracks.map((track) => (
          <li key={track.id} onClick={() => setCurrentTrackUrl(track.audioUrl)}>
            {track.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrackList; 