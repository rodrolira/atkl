// src/utils/utils.ts
// Esta función construye la URL completa de la imagen almacenada en S3
// export const getImageUrlArtists = (imageKey: string) => {
//     if (!imageKey) return "/images/artists/placeholder.png"; // Si no hay clave, usa el placeholder
//     return `https://atkl.s3.us-east-1.amazonaws.com/artists/${imageKey}`;
//   };


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

export const getImageUrlReleases = (imageKey: string) => {
    // Asumimos que las imágenes están almacenadas en un bucket de S3 público
    const baseUrl = 'https://atkl.s3.us-east-1.amazonaws.com/releases/'; // Reemplazar <tu-bucket> con el nombre de tu bucket
    return `${baseUrl}${imageKey}`;
};