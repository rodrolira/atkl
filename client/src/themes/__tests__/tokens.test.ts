import { describe, it, expect } from 'vitest';
import { token, tokenAlpha, tokenHex } from '../tokens';

// En jsdom no hay hoja de estilos cargada, así que getComputedStyle devuelve
// vacío y estas funciones caen en los valores de respaldo. Eso es justo lo que
// queremos verificar: que el respaldo exista y coincida con :root en App.css,
// porque si no, MUI arrancaría con colores equivocados.
describe('puente de tokens hacia MUI', () => {
  it('devuelve los colores del tema', () => {
    expect(token('bg')).toBe('rgb(0 0 0)');
    expect(token('text')).toBe('rgb(255 255 255)');
    expect(token('surface')).toBe('rgb(17 17 17)');
  });

  it('el acento es el rojo de la marca', () => {
    expect(tokenHex('accent')).toBe('e10600');
  });

  // Bandcamp rechaza el '#' y necesita los seis dígitos: un canal como el 6 del
  // rojo (225 6 0) tiene que salir '06' y no '6', o el color se corrompe.
  it('arma el hex con dos dígitos por canal, sin numeral', () => {
    expect(tokenHex('surface')).toBe('111111');
    expect(tokenHex('accent')).not.toContain('#');
    expect(tokenHex('accent')).toHaveLength(6);
  });

  it('aplica opacidad en el formato que entiende MUI', () => {
    expect(tokenAlpha('muted', 0.3)).toBe('rgb(154 154 154 / 0.3)');
  });

  // Sobre negro el hover del acento va más claro, no más oscuro.
  it('el hover del acento aclara sobre el fondo oscuro', () => {
    const canal = (hex: string) => parseInt(hex.slice(0, 2), 16);
    expect(canal(tokenHex('accent-hover'))).toBeGreaterThan(canal(tokenHex('accent')));
  });
});
