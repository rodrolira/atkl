// src/utils/utils.ts
/**
 * Devuelve la URL solo si es http(s). Los links de artistas/lanzamientos vienen
 * de la base de datos, así que un valor como `javascript:...` no debe llegar a
 * un href.
 */
export const safeExternalUrl = (url?: string | null): string | null => {
    if (!url) return null;
    try {
        const parsed = new URL(url, window.location.origin);
        return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : null;
    } catch {
        return null;
    }
};

// getImageUrlReleases/getImageUrlArtists construían URLs contra el bucket S3
// `atkl`, que no existe (404 NoSuchBucket) y nunca se llamaban. Las imágenes
// vienen de Cloudinary con la URL completa ya guardada en la BD.

const UPLOAD_CLOUDINARY = '/image/upload/';

/**
 * Mete un recorte de Cloudinary en la URL que ya está guardada en la BD.
 *
 * Las fotos se suben enteras: el recorte lo hacía la tarjeta, con una caja de
 * alto fijo y `object-cover` centrado, así que una foto donde el artista no
 * cae justo al medio quedaba cortada por la cabeza. `g_auto` deja que
 * Cloudinary elija qué región conservar (prioriza caras) y de paso entrega la
 * imagen al tamaño de la tarjeta en vez del original full-res.
 *
 * Cuadrada a propósito: la tarjeta es 4:5 en móvil y de alto fijo en
 * escritorio, y el cuadrado es lo que menos vuelve a recortar en los dos.
 *
 * Lo que no es de Cloudinary (el placeholder local, un link externo) vuelve
 * tal cual.
 */
export const imagenRecortada = (url?: string | null, lado = 800): string | null => {
    if (!url) return null;
    if (!url.includes('res.cloudinary.com') || !url.includes(UPLOAD_CLOUDINARY)) return url;
    // Si ya trae un recorte, Cloudinary encadenaría los dos y recortaría de
    // nuevo sobre lo recortado.
    if (url.includes('/c_fill')) return url;

    return url.replace(
        UPLOAD_CLOUDINARY,
        `${UPLOAD_CLOUDINARY}c_fill,g_auto,f_auto,q_auto,w_${lado},h_${lado}/`,
    );
};

/**
 * El reproductor embebido de Bandcamp usa `album=<id>` o `track=<id>` según el
 * tipo de release. Usar el prefijo equivocado NO da error: devuelve 200 con un
 * reproductor vacío y sin audio, así que hay que acertarle.
 *
 * El tipo sale de la propia URL del release, que ya está en la BD
 * (`bandcamp_link`): .../album/noesis vs .../track/old-world.
 */
export const bandcampEmbedKind = (bandcampLink?: string | null): 'album' | 'track' =>
    bandcampLink && /\/track\/[^/]/.test(bandcampLink) ? 'track' : 'album';

