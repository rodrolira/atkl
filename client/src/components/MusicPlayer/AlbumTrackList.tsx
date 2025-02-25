import React from "react";
import { Release } from "@/types/interfaces/Release";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import Button from "@mui/material/Button";
import { Track } from "@/types/interfaces/Track";

interface AlbumTrackListProps {
  album: Release;
}

const AlbumTrackList: React.FC<AlbumTrackListProps> = ({ album }) => {
  const { playRelease } = useMusicPlayer();

  const isSingle = album.release_type === "Single";

  const handlePlayRelease = () => {
    if (album.tracks) {
      const formattedTracks: Track[] = album.tracks.map((track: Track) => ({
        id: track.id,
        title: track.title,
        audioUrl: track.audioUrl,
      }));
      playRelease(formattedTracks, isSingle);
    }
  };

  return (
    <div>
      <h3>{album.title}</h3>

      {/* Botón para reproducir el release */}
      <Button onClick={handlePlayRelease} variant="contained" color="secondary">
        ▶ Reproducir {album.release_type}
      </Button>

      {/* Solo mostrar la lista si NO es Single */}
      {!isSingle && (
        <ul>
          {album.tracks?.map((track: Track) => (
            <li key={track.id}>{track.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AlbumTrackList;
