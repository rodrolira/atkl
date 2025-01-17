// src/data/releaseData.ts

import { Release } from '@/types/interfaces/Release'; // Importa la interfaz Release

export const releaseData: Release[] = [
    {
        id: 1,
        title: 'INSANITY',
        genre: { name: 'Hard Techno' },
        release_type: 'EP',
        imageKey: 'insanity_700x700.webp',
        artists: [
            {
                id: 1, artist_name: 'RODRO', artist_image_url: 'uploads/artists/rodro.jpg',
                Roles: [],
                roleIds: [],
                image: null
            },
        ],
        bandcamp_link: 'https://bandcamp.com/rodro/vol1',
        spotify_link: 'https://spotify.com/album/1',
        apple_music_link: 'https://music.apple.com/album/1',
        youtube_link: 'https://youtube.com/watch?v=1',
        soundcloud_link: 'https://soundcloud.com/rodro/vol1',
        beatport_link: 'https://beatport.com/track/1',
        release_date: '2024-01-01',
    },
    {
        id: 2,
        title: 'Crying',
        genre: { name: 'Dark Techno' },
        release_type: 'Single',
        imageKey: 'Crying_700x700.webp',
        artists: [
            {
                artist_name: 'TAXDOG'

            },
        ],
        bandcamp_link: 'https://bandcamp.com/djx/industrial-vibes',
        spotify_link: 'https://spotify.com/album/2',
        apple_music_link: 'https://music.apple.com/album/2',
        youtube_link: 'https://youtube.com/watch?v=2',
        soundcloud_link: 'https://soundcloud.com/djx/industrial-vibes',
        beatport_link: 'https://beatport.com/track/2',
        release_date: '2024-02-01',
    },
    {
        id: 3,
        title: 'Acid Rave Anthems',
        genre: { name: 'Acid Techno' },
        release_type: 'Album',
        imageKey: 'F2023_700x700.webp',
        artists: [
            {
                artist_name: 'n3o'
            },
        ],
        bandcamp_link: 'https://bandcamp.com/techno-raver/acid-rave',
        spotify_link: 'https://spotify.com/album/3',
        apple_music_link: 'https://music.apple.com/album/3',
        youtube_link: 'https://youtube.com/watch?v=3',
        soundcloud_link: 'https://soundcloud.com/techno-raver/acid-rave',
        beatport_link: 'https://beatport.com/track/3',
        release_date: '2024-03-01',
    },
    {
        id: 4,
        title: 'Two-Sides',
        genre: { name: 'Techno' },
        release_type: 'EP',
        imageKey: 'Two-Sides_700x700.webp',
        artists: [
            {
                artist_name: 'BbaphometT',
                id: 4,

            },
        ],
        bandcamp_link: 'https://bandcamp.com/djx/industrial-vibes',
        spotify_link: 'https://spotify.com/album/4',
        apple_music_link: 'https://music.apple.com/album/4',
        youtube_link: 'https://youtube.com/watch?v=4',
        soundcloud_link: 'https://soundcloud.com/djx/industrial-vibes',
        beatport_link: 'https://beatport.com/track/4',
        release_date: '2024-04-01',
    },
    {
        id: 5,
        title: 'Unknown-VA-I',
        genre: { name: 'Hard Techno' },
        release_type: 'Single',
        imageKey: 'Unknown-VA-I.webp',
        artists: [
            {
                artist_name: 'Various Artists',
            },
        ],
        bandcamp_link: 'https://atklrecords.bandcamp.com/album/unknown-va-i-ukn001',
        spotify_link: 'https://spotify.com/album/5',
        apple_music_link: 'https://music.apple.com/album/5',
        youtube_link: 'https://youtube.com/watch?v=5',
        soundcloud_link: 'https://soundcloud.com/unknown-va-i',
        beatport_link: 'https://beatport.com/track/5',
        release_date: '2024-05-01',
    },
    {
        id: 6,
        title: 'Zena',
        genre: { name: 'Techno' },
        release_type: 'EP',
        imageKey: 'zena_700x700.webp',
        artists: [
            {
                artist_name: '23ones',
            },
        ],
        bandcamp_link: 'https://bandcamp.com/djx/industrial-vibes',
        spotify_link: 'https://spotify.com/album/6',
        apple_music_link: 'https://music.apple.com/album/6',
        youtube_link: 'https://youtube.com/watch?v=6',
        soundcloud_link: 'https://soundcloud.com/djx/industrial-vibes',
        beatport_link: 'https://beatport.com/track/6',
        release_date: '2024-06-01',
    },
    // Agregar más lanzamientos aquí si es necesario
];
