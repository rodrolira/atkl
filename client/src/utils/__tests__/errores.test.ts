import { describe, it, expect } from 'vitest';
import { mensajeDeError } from '../errores';

const axiosError = (data: unknown) => ({
  message: 'Request failed with status code 500',
  response: { data },
});

describe('mensajeDeError', () => {
  it('arma la lista cuando el servidor manda los campos que fallaron', () => {
    const error = axiosError({
      message: 'Datos inválidos',
      errores: [{ campo: 'email', mensaje: 'no es válido' }],
    });

    expect(mensajeDeError(error, 'respaldo')).toBe('email: no es válido');
  });

  it('usa el message de las rutas', () => {
    expect(mensajeDeError(axiosError({ message: 'Artist not found' }), 'respaldo')).toBe(
      'Artist not found'
    );
  });

  // El manejador global de app.js responde { error: { message } }, que es lo
  // que sale cuando falla un middleware antes del handler de la ruta: con
  // credenciales de Cloudinary que no coinciden se veía solo el respaldo y el
  // motivo quedaba en la consola.
  it('lee también la forma del manejador global', () => {
    const error = axiosError({ error: { message: 'No se pudo subir la imagen: Invalid Signature' } });

    expect(mensajeDeError(error, 'respaldo')).toBe(
      'No se pudo subir la imagen: Invalid Signature'
    );
  });

  // "Request failed with status code 500" no le dice nada a nadie.
  it('sin respuesta del servidor usa el respaldo', () => {
    expect(mensajeDeError(axiosError(undefined), 'respaldo')).toBe('respaldo');
    expect(mensajeDeError(new Error('Network Error'), 'respaldo')).toBe('respaldo');
  });
});
