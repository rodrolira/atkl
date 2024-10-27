import { Artist } from "./Artist";

export interface Release {
    id: number;
    title: string;
    artists: Artist[];
    cover_image_url: string;
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
    fetchReleases:   ;
    updateRelease: (releaseId: number, updatedRelease: Partial<Release>) => Promise<void>;
    deleteRelease: (releaseId: number) => Promise<void>;
}

export interface ReleaseContextType {
    releases: Release[];
    setReleases: React.Dispatch<React.SetStateAction<Release[]>>;
    updateRelease: (id: number, updatedRelease: Partial<Release>) => Promise<void>;
    fetchRelease: (id: number) => Promise<Release>;
    fetchReleases:  ;
    error: string | null;
    deleteRelese: (id: number) => Promise<void>;
}