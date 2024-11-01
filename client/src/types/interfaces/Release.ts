import { Artist } from "./Artist";
import { Genre } from "./Genre";

export interface Release {
    id: number;
    title: string;
    artists: Artist[];
    cover_image_url: string;
    genre_id: string | null;
    genre: Genre;
    release_type: string;
    release_date?: string;
    bandcamp_link?: string;
    spotify_link?: string;
    apple_music_link?: string;
    youtube_link?: string;
    soundcloud_link?: string;
    beatport_link?: string;
    [key: string]: any;
}

export interface UseReleaseReturn {
    release: Release | null;
    error: string | null;
    fetchRelease: (releaseId: number) => Promise<void>;
    updateRelease: (releaseId: number, updatedRelease: Partial<Release>) => Promise<void>;
    deleteRelease: (releaseId: number) => Promise<void>;
}

export interface ReleaseContextType {
        releases: Release[];
        loading: boolean;
        error: string | null;
        fetchReleases: () => Promise<void>;
        fetchRelease: (id: number) => Promise<Release>;
        createRelease: (release: Release) => Promise<void>;
        updateRelease: (id: number, updatedRelease: Partial<Release>) => Promise<void>;
        deleteRelease: (id: number) => Promise<void>;
        setReleases: React.Dispatch<React.SetStateAction<Release[]>>;
    }
    