import { describe, it, expect } from 'vitest';
import { imagenRecortada } from '../utils';

const CLOUDINARY = 'https://res.cloudinary.com/dotfwyxwr/image/upload/v1700000000/atkl/artista.jpg';

describe('imagenRecortada', () => {
  it('mete el recorte con gravedad automática justo después de /upload/', () => {
    expect(imagenRecortada(CLOUDINARY)).toBe(
      'https://res.cloudinary.com/dotfwyxwr/image/upload/c_fill,g_auto,f_auto,q_auto,w_800,h_800/v1700000000/atkl/artista.jpg',
    );
  });

  it('respeta el lado que le pasen', () => {
    expect(imagenRecortada(CLOUDINARY, 400)).toContain('w_400,h_400');
  });

  // El placeholder se sirve desde /public: si le pegáramos la transformación
  // quedaría una ruta inexistente y la tarjeta se mostraría sin imagen.
  it('deja pasar el placeholder local y cualquier URL que no sea de Cloudinary', () => {
    expect(imagenRecortada('/images/placeholder.svg')).toBe('/images/placeholder.svg');
    expect(imagenRecortada('https://ejemplo.com/foto.jpg')).toBe('https://ejemplo.com/foto.jpg');
  });

  it('no encadena un segundo recorte sobre una URL ya transformada', () => {
    const yaRecortada = imagenRecortada(CLOUDINARY) as string;

    expect(imagenRecortada(yaRecortada)).toBe(yaRecortada);
  });

  it('devuelve null cuando el artista no tiene imagen', () => {
    expect(imagenRecortada(undefined)).toBeNull();
    expect(imagenRecortada('')).toBeNull();
  });
});
