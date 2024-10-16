export interface FormValues {
    username: string;
    password: string;
    rememberMe: boolean;
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

export type FormData = ReleaseFormData | UserFormData;