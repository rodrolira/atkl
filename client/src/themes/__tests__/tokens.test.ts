import { describe, it, expect } from 'vitest';
import { token, tokenAlpha, tokenHex } from '../tokens';

// En jsdom no hay hoja de estilos cargada, así que getComputedStyle devuelve
// vacío y estas funciones caen en los valores de respaldo. Eso es justo lo que
// queremos verificar: que el respaldo exista y coincida con los tokens de
// App.css, porque si no, MUI arrancaría con colores equivocados.
describe('puente de tokens hacia MUI', () => {
  it('devuelve el color del modo pedido', () => {
    expect(token('bg', 'dark')).toBe('rgb(0 0 0)');
    expect(token('bg', 'light')).toBe('rgb(255 255 255)');
    expect(token('text', 'dark')).toBe('rgb(255 255 255)');
    expect(token('text', 'light')).toBe('rgb(10 10 10)');
  });

  it('el acento es el mismo rojo de la marca en los dos modos', () => {
    expect(tokenHex('accent', 'dark')).toBe('e10600');
    expect(tokenHex('accent', 'light')).toBe('e10600');
  });

  // Bandcamp rechaza el '#' y necesita los seis dígitos: un canal como el 6 del
  // rojo (225 6 0) tiene que salir '06' y no '6', o el color se corrompe.
  it('arma el hex con dos dígitos por canal, sin numeral', () => {
    expect(tokenHex('surface', 'dark')).toBe('111111');
    expect(tokenHex('surface', 'light')).toBe('f4f4f4');
    expect(tokenHex('accent', 'dark')).not.toContain('#');
    expect(tokenHex('accent', 'dark')).toHaveLength(6);
  });

  it('aplica opacidad en el formato que entiende MUI', () => {
    expect(tokenAlpha('muted', 'dark', 0.3)).toBe('rgb(154 154 154 / 0.3)');
  });

  // El gris atenuado NO es el mismo en los dos modos: #9A9A9A sobre blanco da
  // 2,85:1 y no llega a AA, por eso en claro se usa #4A4A4A.
  it('usa un gris distinto por modo para no romper el contraste', () => {
    expect(tokenHex('muted', 'dark')).toBe('9a9a9a');
    expect(tokenHex('muted', 'light')).toBe('4a4a4a');
  });
});
