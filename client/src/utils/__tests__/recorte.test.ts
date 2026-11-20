import { describe, it, expect } from 'vitest';
import { dimensionesSalida, nombreRecortado, LADO_MAXIMO } from '../recorte';

describe('dimensionesSalida', () => {
  it('achica hasta el tope respetando la proporción', () => {
    expect(dimensionesSalida(6000, 4000)).toEqual({ ancho: LADO_MAXIMO, alto: 800 });
  });

  it('toma el lado más largo para calcular la escala', () => {
    expect(dimensionesSalida(4000, 6000)).toEqual({ ancho: 800, alto: LADO_MAXIMO });
  });

  // Agrandar solo suma peso y deja la foto borrosa.
  it('deja intacto un recorte más chico que el tope', () => {
    expect(dimensionesSalida(500, 400)).toEqual({ ancho: 500, alto: 400 });
  });

  it('nunca devuelve un lado en cero', () => {
    expect(dimensionesSalida(1, 10000)).toEqual({ ancho: 1, alto: LADO_MAXIMO });
  });
});

describe('nombreRecortado', () => {
  // El servidor arma el public_id de Cloudinary con el nombre original.
  it('cambia la extensión porque el canvas siempre devuelve JPEG', () => {
    expect(nombreRecortado('retrato.png')).toBe('retrato-recorte.jpg');
  });

  it('solo saca la última extensión', () => {
    expect(nombreRecortado('foto.final.v2.jpeg')).toBe('foto.final.v2-recorte.jpg');
  });

  it('aguanta un nombre sin extensión', () => {
    expect(nombreRecortado('retrato')).toBe('retrato-recorte.jpg');
  });
});
