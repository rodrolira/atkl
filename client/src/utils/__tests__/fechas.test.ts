import { describe, it, expect } from 'vitest';
import { formatearFechaLanzamiento, fechaISOCorta } from '../fechas';

// Como llega de la API: timestamp a medianoche UTC.
const LANZAMIENTO = '2024-01-04T00:00:00.000Z';

describe('formatearFechaLanzamiento', () => {
  // El bug que evita: formateado en hora local, en UTC-3 el 4 se ve como 3.
  it('mantiene el dia calendario sin importar la zona del navegador', () => {
    expect(formatearFechaLanzamiento(LANZAMIENTO, 'es')).toContain('4');
    expect(formatearFechaLanzamiento(LANZAMIENTO, 'es')).toContain('2024');
    expect(formatearFechaLanzamiento(LANZAMIENTO, 'es')).not.toContain('3 ');
  });

  it('respeta el idioma', () => {
    expect(formatearFechaLanzamiento(LANZAMIENTO, 'en')).toMatch(/Jan/i);
    expect(formatearFechaLanzamiento(LANZAMIENTO, 'es')).toMatch(/ene/i);
  });

  // La tarjeta se saltea la linea en vez de escribir "Invalid Date".
  it('devuelve null cuando no hay fecha o es ilegible', () => {
    expect(formatearFechaLanzamiento(null)).toBeNull();
    expect(formatearFechaLanzamiento(undefined)).toBeNull();
    expect(formatearFechaLanzamiento('')).toBeNull();
    expect(formatearFechaLanzamiento('no es una fecha')).toBeNull();
  });
});

describe('fechaISOCorta', () => {
  it('recorta a YYYY-MM-DD para el atributo dateTime', () => {
    expect(fechaISOCorta(LANZAMIENTO)).toBe('2024-01-04');
  });

  it('devuelve null cuando no hay fecha o es ilegible', () => {
    expect(fechaISOCorta(null)).toBeNull();
    expect(fechaISOCorta('cualquier cosa')).toBeNull();
  });
});
