import { Artist } from "./Artist";

export default interface Release {
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
    [key: string]: any;

}