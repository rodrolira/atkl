import { Role } from "./Role";


export interface Artist {
    id: number;
    artist_name: string;
    image: string | File | null;
    Roles: Role[] | string[];
    roleIds: number[];
    bio?: string;
    twitter_link?: string;
    instagram_link?: string;
    facebook_link?: string;
    soundcloud_link?: string;
    bandcamp_link?: string;
    youtube_link?: string;
    spotify_link?: string;
    beatport_link?: string;
    apple_music_link?: string;
    [key: string]: any;

  }

  export interface UseArtistReturn {
    artist: Artist | null;
    error: string | null;
    fetchArtist: (artistId: number) => Promise<void>;
    updateArtist: (artistId: number, updatedArtist: Partial<Artist>) => Promise<void>;
    deleteArtist: (artistId: number) => Promise<void>;
  }
  
  export interface ArtistContextType {
    artists: Artist[];
    fetchArtists: () => Promise<void>;
    setArtists: React.Dispatch<React.SetStateAction<Artist[]>>;
    createArtist: (artist: Artist) => Promise<Artist | null>;
    updateArtist: (id: number, updatedArtist: Partial<Artist>) => Promise<void>; // Asegúrate de que esto sea una Promise
    deleteArtist: (id: number) => Promise<void>;
    error: string | null;
    loading: boolean;
  }
  