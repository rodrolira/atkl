import React, { createContext, useState, useContext } from "react";
import { Release } from "@/types/interfaces/Release";
import { Track } from "@/types/interfaces/Track";
interface MusicPlaylistContextType {
    playlist: Track[];
    addToPlaylist: (track: Track) => void;
    removeFromPlaylist: (trackId: number) => void;
    clearPlaylist: () => void;
}

const MusicPlaylistContext = createContext<MusicPlaylistContextType | undefined>(undefined);

export const MusicPlaylistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [playlist, setPlaylist] = useState<Track[]>([]);

    const addToPlaylist = (track: Track) => {
        setPlaylist((prev) => [...prev, track]);
    };

    const removeFromPlaylist = (trackId: number) => {
        setPlaylist((prev) => prev.filter((track) => track.id !== trackId));
    };

    const clearPlaylist = () => setPlaylist([]);

    return (
        <MusicPlaylistContext.Provider value={{ playlist, addToPlaylist, removeFromPlaylist, clearPlaylist }}>
            {children}
        </MusicPlaylistContext.Provider>
    );
};

export const useMusicPlaylist = () => {
    const context = useContext(MusicPlaylistContext);
    if (!context) throw new Error("useMusicPlaylist must be used within a MusicPlaylistProvider");
    return context;
};
