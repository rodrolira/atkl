/**
 * Saca el mensaje que mandó el servidor de un error de axios.
 *
 * Hasta ahora los formularios mostraban un texto fijo ("No se pudo guardar")
 * y el motivo real quedaba solo en la consola, así que un 400 por un campo
 * inválido se veía igual que un 500. Las rutas de artistas responden
 * `{ message, errores: [{ campo, mensaje }] }`; si vienen los `errores` se
 * arman en una lista para que se entienda qué campo falló.
 */
type ErrorDeApi = {
  response?: {
    data?: {
      message?: string;
      errores?: Array<{ campo?: string; mensaje?: string }>;
    };
  };
  message?: string;
};

export const mensajeDeError = (error: unknown, respaldo: string): string => {
  const datos = (error as ErrorDeApi)?.response?.data;

  if (datos?.errores?.length) {
    return datos.errores
      .map((e) => (e.campo ? `${e.campo}: ${e.mensaje}` : e.mensaje))
      .filter(Boolean)
      .join(' · ');
  }

  // `message` de axios ("Request failed with status code 500") no le dice nada
  // a nadie: solo sirve el del servidor.
  return datos?.message || respaldo;
};
