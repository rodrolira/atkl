import { v2 as cloudinary } from 'cloudinary';
import { loadEnv } from './loadEnv.js';

loadEnv();

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

// Configuración de Cloudinary.
//
// Se aceptan las dos formas en las que el panel de Cloudinary entrega las
// credenciales: las tres variables sueltas, o CLOUDINARY_URL, que es la cadena
// `cloudinary://api_key:api_secret@cloud_name` que muestra por defecto.
//
// Antes se le pasaban siempre las tres: con CLOUDINARY_URL cargada y las
// sueltas ausentes, ese objeto lleno de `undefined` le pisaba al SDK la
// configuración que ya había armado solo, y cada subida moría con "Must supply
// cloud_name" (o firmaba con un secret viejo y Cloudinary contestaba "Invalid
// Signature"). En los dos casos el panel solo veía un error al subir la imagen.
if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
} else {
  // `true` fuerza releer el entorno. Hace falta: los imports se evalúan antes
  // que el cuerpo del módulo, así que el SDK ya miró el entorno una vez,
  // cuando loadEnv() todavía no había cargado el .env.
  cloudinary.config(true);
}

export default cloudinary;
