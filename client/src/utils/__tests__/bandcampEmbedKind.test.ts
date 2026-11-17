import { describe, it, expect } from 'vitest';
import { bandcampEmbedKind, bandcampEmbedHeight } from '../utils';

describe('bandcampEmbedHeight', () => {
    it('crece una fila por track', () => {
        expect(bandcampEmbedHeight(2) - bandcampEmbedHeight(1)).toBe(33);
        expect(bandcampEmbedHeight(10) - bandcampEmbedHeight(9)).toBe(33);
    });

    // Valores medidos contra el embed real en su tema CLARO, buscando el alto
    // mínimo sin scroll interno: 1 track necesita 170 y 10 tracks 470 (a 350 y
    // a 480px de ancho da lo mismo). La fórmula da 176 y 473.
    //
    // El tema oscuro usaba filas de 27 en vez de 33; estos números solo valen
    // mientras BandcampPlayer mande un bgcol claro. Si Bandcamp cambia su
    // layout, falla acá y no en silencio sobre la página.
    it('coincide con los altos medidos en el embed real', () => {
        expect(bandcampEmbedHeight(1)).toBe(176);
        expect(bandcampEmbedHeight(2)).toBe(209);
        expect(bandcampEmbedHeight(10)).toBe(473);
    });

    it('sin dato trata el release como de un track', () => {
        expect(bandcampEmbedHeight(undefined)).toBe(bandcampEmbedHeight(1));
        expect(bandcampEmbedHeight(null)).toBe(bandcampEmbedHeight(1));
        // 0 tracks no debe colapsar el iframe ni dar un alto negativo.
        expect(bandcampEmbedHeight(0)).toBe(bandcampEmbedHeight(1));
    });

    it('topea los releases largos para que la tarjeta no se dispare', () => {
        expect(bandcampEmbedHeight(500)).toBe(bandcampEmbedHeight(12));
    });
});

// El prefijo equivocado no falla con error: Bandcamp devuelve 200 y un
// reproductor vacío. Sin este test la regresión pasa desapercibida.
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
