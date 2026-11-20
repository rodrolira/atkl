// src/utils/recorte.ts
import type { Area } from 'react-easy-crop';

/**
 * Lado máximo del recorte que se sube.
 *
 * La tarjeta muestra la foto a 384px y Cloudinary igual la vuelve a servir
 * reducida: subir los 6000px que sale de un celular es ancho de banda tirado
 * y una subida que tarda.
 */
export const LADO_MAXIMO = 1200;

/**
 * Tamaño final del recorte: respeta la proporción elegida y nunca agranda.
 * Una selección más chica que el tope se sube tal cual; escalarla hacia
 * arriba solo agrega peso y la deja borrosa.
 */
export const dimensionesSalida = (
    ancho: number,
    alto: number,
    maximo = LADO_MAXIMO,
): { ancho: number; alto: number } => {
    const escala = Math.min(1, maximo / Math.max(ancho, alto));

    return {
        ancho: Math.max(1, Math.round(ancho * escala)),
        alto: Math.max(1, Math.round(alto * escala)),
    };
};

/**
 * Le cambia la extensión al nombre original.
 *
 * El servidor arma el `public_id` de Cloudinary con `file.originalname`: si
 * dejamos "foto.png" en un archivo que ahora es JPEG, queda un nombre que
 * miente sobre el contenido.
 */
export const nombreRecortado = (nombre: string): string =>
    `${nombre.replace(/\.[^./\\]+$/, '') || 'imagen'}-recorte.jpg`;

const cargarImagen = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const imagen = new Image();
        imagen.addEventListener('load', () => resolve(imagen));
        imagen.addEventListener('error', () => reject(new Error('No se pudo leer la imagen.')));
        imagen.src = src;
    });

/**
 * Devuelve un File nuevo con solo la región elegida.
 *
 * `area` viene de react-easy-crop ya en píxeles de la imagen original, así que
 * acá no hay que rehacer ninguna cuenta de escala.
 */
export const recortarImagen = async (src: string, area: Area, nombre: string): Promise<File> => {
    const imagen = await cargarImagen(src);
    const { ancho, alto } = dimensionesSalida(area.width, area.height);

    const lienzo = document.createElement('canvas');
    lienzo.width = ancho;
    lienzo.height = alto;

    const contexto = lienzo.getContext('2d');
    if (!contexto) {
        throw new Error('No se pudo recortar la imagen en este navegador.');
    }

    contexto.drawImage(imagen, area.x, area.y, area.width, area.height, 0, 0, ancho, alto);

    const blob = await new Promise<Blob | null>((resolve) =>
        lienzo.toBlob(resolve, 'image/jpeg', 0.9),
    );
    if (!blob) {
        throw new Error('No se pudo generar la imagen recortada.');
    }

    return new File([blob], nombreRecortado(nombre), { type: 'image/jpeg' });
};
