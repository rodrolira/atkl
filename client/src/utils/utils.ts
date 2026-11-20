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

