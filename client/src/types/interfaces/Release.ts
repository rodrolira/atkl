import { Artist } from "./Artist";
import { Track } from "./Track";

export interface Release {
    id: number;
    title: string;
    imageUrl: string;
    genre?:{
        name: string;
    }
    release_type: string;
    release_date?: string;
    bandcamp_link?: string;
    /** ID numérico del álbum en Bandcamp, para el reproductor embebido. */
    bandcamp_album_id?: string;
    /** Cantidad de tracks: define el alto del iframe de Bandcamp. */
    bandcamp_track_count?: number;
    spotify_link?: string;
    apple_music_link?: string;
    youtube_link?: string;
    soundcloud_link?: string;
    beatport_link?: string;
    artist?: Artist[];
    artists?: Artist[];
    tracks?: Track[];
    [key: string]: any;
}

export interface ReleaseContextType {
        releases: Release[];
        loading: boolean;
        error: string | null;
        fetchReleases: () => Promise<void>;
        createRelease: (release: Release) => Promise<void>;
        updateRelease: (id: number, updatedRelease: Partial<Release>) => Promise<void>;
        deleteRelease: (id: number) => Promise<void>;
        setReleases: React.Dispatch<React.SetStateAction<Release[]>>;
        clearReleases: () => void;
    }
    