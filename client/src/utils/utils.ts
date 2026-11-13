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

/**
 * Encabezado del embed grande (portada, título, play, barra de progreso) más el
 * colchón inferior. Medido sobre el embed real a 580px de ancho: con 170px
 * entra justo una fila y con 155px se corta.
 */
const BANDCAMP_HEADER_PX = 143;
/** Alto de cada fila de la lista. Verificado: 1 track = 170, 2 tracks = 197. */
const BANDCAMP_TRACK_ROW_PX = 27;
/**
 * Tope de filas que se muestran sin scroll. Más allá, la lista scrollea dentro
 * del propio iframe en vez de estirar la tarjeta sin límite. El release más
 * largo del sello hoy tiene 10 tracks.
 */
const BANDCAMP_MAX_ROWS = 12;

/**
 * El iframe de Bandcamp es cross-origin: no se puede medir su contenido ni
 * dejar que se autoajuste, así que el alto se calcula desde la cantidad de
 * tracks. Quedarse corto corta la lista sin aviso.
 */
export const bandcampEmbedHeight = (trackCount?: number | null): number => {
    const tracks = Math.max(1, Math.min(trackCount ?? 1, BANDCAMP_MAX_ROWS));
    return BANDCAMP_HEADER_PX + tracks * BANDCAMP_TRACK_ROW_PX;
};