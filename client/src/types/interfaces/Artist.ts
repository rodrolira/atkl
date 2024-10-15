import { Role } from "./Role";


export interface Artist {
    id: number;
    artist_name: string;
    image: string;
    Roles: Role[];
    bio?: string;
    twitter_link?: string;
    instagram_link?: string;
    facebook_link?: string;
    soundcloud_link?: string;
    bandcamp_link?: string;
    youtube_link?: string;
    spotify_link?: string;
    beatport_link?: string;
  
  }