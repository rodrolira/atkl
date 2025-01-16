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
        imageKey: 'uploads/releases/Crying_700x700.webp',
        artists: [
            {
                id: 2, artist_name: 'TAXDOG', artist_image_url: 'uploads/artists/dj_x.jpg',
                Roles: [],
                roleIds: [],
                image: null
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
        imageKey: 'uploads/releases/cover3.jpg',
        artists: [
            {
                id: 3, artist_name: 'Techno Raver', artist_image_url: 'uploads/artists/techno_raver.jpg',
                Roles: [],
                roleIds: [],
                image: null
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
    // Agregar más lanzamientos aquí si es necesario
];
