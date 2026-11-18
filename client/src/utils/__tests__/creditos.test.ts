import { describe, it, expect } from 'vitest';
import { separarCreditos, unirCreditos, creditosSinFicha } from '../creditos';

describe('separarCreditos', () => {
  it('parte por coma y limpia espacios', () => {
    expect(separarCreditos('BbaphometT, thunder21')).toEqual(['BbaphometT', 'thunder21']);
  });

  it('sin crédito devuelve lista vacía', () => {
    expect(separarCreditos(undefined)).toEqual([]);
    expect(separarCreditos(null)).toEqual([]);
    expect(separarCreditos('  ,  ')).toEqual([]);
  });

  // Partir por "&" o " y " rompería nombres reales en dos artistas inventados.
  it('no parte nombres que traen & o y', () => {
    expect(separarCreditos('Simon & Garfunkel')).toEqual(['Simon & Garfunkel']);
  });
});

describe('unirCreditos', () => {
  it('arma la línea con coma y espacio', () => {
    expect(unirCreditos(['RODRO', 'KURSE'])).toBe('RODRO, KURSE');
  });

  it('descarta vacíos y repetidos sin importar mayúsculas', () => {
    expect(unirCreditos(['RODRO', '', '  ', 'rodro'])).toBe('RODRO');
  });
});

describe('creditosSinFicha', () => {
  it('deja fuera a los que ya van con link', () => {
    expect(creditosSinFicha('RODRO, KURSE', [{ artist_name: 'RODRO' }])).toEqual(['KURSE']);
  });

  it('compara sin importar mayúsculas ni espacios', () => {
    expect(creditosSinFicha(' rodro ', [{ artist_name: 'RODRO' }])).toEqual([]);
  });

  // El caso del catálogo importado: 13 de 15 lanzamientos no tienen ficha
  // vinculada y el nombre vive solo en el crédito.
  it('sin fichas vinculadas devuelve todo el crédito', () => {
    expect(creditosSinFicha('BbaphometT, thunder21', [])).toEqual(['BbaphometT', 'thunder21']);
  });
});
