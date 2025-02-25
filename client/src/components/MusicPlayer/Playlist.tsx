import React from "react";
import { useMusicPlaylist } from "@/contexts/MusicPlaylistContext";
import Button from "@mui/material/Button";

const Playlist: React.FC = () => {
  const { playlist, removeFromPlaylist, clearPlaylist } = useMusicPlaylist();

  return (
    <div>
      <h2>Mi Playlist</h2>
      <ul>
        {playlist.map((track) => (
          <li key={track.id}>
            {track.title}
            <Button onClick={() => removeFromPlaylist(track.id)} color="secondary">
              Eliminar
            </Button>
          </li>
        ))}
      </ul>
      {playlist.length > 0 && (
        <Button onClick={clearPlaylist} variant="outlined">
          Limpiar Playlist
        </Button>
      )}
    </div>
  );
};

export default Playlist;
