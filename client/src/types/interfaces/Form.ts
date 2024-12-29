export interface FormValues {
    username: string;
    password: string;
    rememberMe: boolean;
    [key: string]: string | string[] | undefined | boolean ;
}

export interface ReleaseFormValues {
    title: string;
    cover_image_url: string;
    description: string;
    genre_id: string;
    release_type: string;
    artist_id: number[] | string[] | undefined | boolean ;
    is_explicit: boolean;
    artists: string[];
    release_date: string;
    bandcamp_link: string;
    spotify_link: string;
    apple_music_link: string;
    youtube_link: string;
    soundcloud_link: string;
    beatport_link: string;
}

export interface ReleaseFormData {
    release_name: string;
    artist_name: string;
    release_date: string;
}

export interface UserFormData {
    artist_name: string;
    email: string;
    password: string;
}

export type FormData = ReleaseFormData | UserFormData | any;