import { Role } from "./Role";


export interface Artist {
    // Requerido a propósito: un artista que viene del API siempre lo tiene, y
    // tenerlo opcional obligaba a guardas por `undefined` en cada tabla y cada
    // borrado. Para el alta, donde el id todavía no existe, está NuevoArtist.
    id: number;
    artist_name: string;
    imageUrl?: string;
    Roles?: Role[] | string[];
    roleIds?: number[];
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

  /** Artista todavía sin guardar: el id lo asigna la base. */
  export type NuevoArtist = Omit<Artist, 'id'>;

  export interface ArtistContextType {
    artists: Artist[];
    fetchArtists: () => Promise<void>;
    setArtists: React.Dispatch<React.SetStateAction<Artist[]>>;
    createArtist: (artist: NuevoArtist) => Promise<Artist>;
    updateArtist: (id: number, updatedArtist: Partial<Artist>) => Promise<void>; // Asegúrate de que esto sea una Promise
    deleteArtist: (id: number) => Promise<void>;
    error: string | null;
    loading: boolean;
  }
  