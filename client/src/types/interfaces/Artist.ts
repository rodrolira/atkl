import { Role } from "./Role";


export interface Artist {
    id: number;
    artist_name: string;
    email: string;
    image: string | File | null;
    Roles: Role[];
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
    setArtists: React.Dispatch<React.SetStateAction<Artist[]>>;
    createArtist: (artist: Artist) => Promise<Artist | undefined>;
    fetchArtists: () => Promise<void>;
    fetchArtist: (id: number) => Promise<Artist>;
    error: string | null;
    loading: boolean;
    updateArtist: (id: string, updatedArtist: Artist) => Promise<void>;
    deleteArtist: (id: string) => Promise<void>;
  }
  