import { describe, it, expect } from 'vitest';
import { bandcampEmbedKind } from '../utils';

describe('bandcampEmbedKind', () => {
    it('usa track para releases de un solo track', () => {
        expect(bandcampEmbedKind('https://atklrecords.bandcamp.com/track/old-world')).toBe('track');
        expect(bandcampEmbedKind('https://atklrecords.bandcamp.com/track/crying-taxdog-hpn001')).toBe('track');
    });

    it('usa album para álbumes, EPs y compilados', () => {
        expect(bandcampEmbedKind('https://atklrecords.bandcamp.com/album/noesis')).toBe('album');
        expect(bandcampEmbedKind('https://atklrecords.bandcamp.com/album/unknown-va-i-ukn001')).toBe('album');
    });

    it('cae en album cuando no hay link', () => {
        expect(bandcampEmbedKind(undefined)).toBe('album');
        expect(bandcampEmbedKind(null)).toBe('album');
        expect(bandcampEmbedKind('')).toBe('album');
    });

    it('no confunde un álbum cuyo slug contiene la palabra track', () => {
        expect(bandcampEmbedKind('https://atklrecords.bandcamp.com/album/bonus-track-edition')).toBe('album');
        // /track/ sin slug no identifica nada: tratarlo como álbum.
        expect(bandcampEmbedKind('https://atklrecords.bandcamp.com/track/')).toBe('album');
    });
});
