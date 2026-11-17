import { describe, it, expect } from 'vitest';
import { seccionDominante, registrarEntradas } from '../useActiveNavItem';

/** Entrada mínima del observer: solo lo que lee registrarEntradas. */
const entrada = (id: string, alto: number | null) => ({
    target: { id } as Element,
    isIntersecting: alto !== null,
    intersectionRect: { height: alto ?? 0 } as DOMRectReadOnly,
});

describe('registrarEntradas', () => {
    it('acumula entre llamadas en vez de reemplazar', () => {
        // La regresión: el observer avisa solo de lo que cambió. Si la segunda
        // llamada se tomara como la foto completa, releases desaparecía y el
        // subrayado saltaba a about con la pantalla todavía en releases.
        const altoVisible = new Map<string, number>();

        registrarEntradas(altoVisible, [entrada('releases', 300)]);
        registrarEntradas(altoVisible, [entrada('about', 40)]);

        expect(altoVisible.get('releases')).toBe(300);
        expect(seccionDominante(altoVisible)).toBe('releases');
    });

    it('saca la sección que dejó de intersectar', () => {
        const altoVisible = new Map<string, number>();

        registrarEntradas(altoVisible, [entrada('demo', 200)]);
        registrarEntradas(altoVisible, [entrada('demo', null)]);

        expect(altoVisible.has('demo')).toBe(false);
        expect(seccionDominante(altoVisible)).toBeNull();
    });

    it('actualiza el alto cuando la misma sección vuelve a informar', () => {
        const altoVisible = new Map<string, number>();

        registrarEntradas(altoVisible, [entrada('artists', 300), entrada('releases', 100)]);
        // artists se va saliendo de la banda y releases la va llenando.
        registrarEntradas(altoVisible, [entrada('artists', 60), entrada('releases', 280)]);

        expect(seccionDominante(altoVisible)).toBe('releases');
    });
});

describe('seccionDominante', () => {
    it('sin ninguna sección en la banda no hay activo', () => {
        // Es el hero: el navbar cae de vuelta en Home.
        expect(seccionDominante(new Map())).toBeNull();
    });

    it('con una sola sección gana esa', () => {
        expect(seccionDominante(new Map([['releases', 120]]))).toBe('releases');
    });

    it('gana la que ocupa más alto, no la que está más completa', () => {
        // El caso que rompía: contact entra entero en la banda (ratio 1) pero
        // ocupa 40px, mientras releases la cruza de punta a punta con 300.
        // Ordenando por intersectionRatio ganaba contact.
        expect(seccionDominante(new Map([['releases', 300], ['contact', 40]]))).toBe('releases');
    });

    it('el orden en que llegan las secciones no cambia el resultado', () => {
        const a = new Map([['about', 50], ['demo', 220]]);
        const b = new Map([['demo', 220], ['about', 50]]);
        expect(seccionDominante(a)).toBe('demo');
        expect(seccionDominante(b)).toBe('demo');
    });

    it('ignora las secciones que quedaron en cero', () => {
        expect(seccionDominante(new Map([['artists', 0]]))).toBeNull();
    });
});
