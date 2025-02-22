// src/utils/utils.ts
// Esta función construye la URL completa de la imagen almacenada en S3
// export const getImageUrlArtists = (imageKey: string) => {
//     if (!imageKey) return "/images/artists/placeholder.png"; // Si no hay clave, usa el placeholder
//     return `https://atkl.s3.us-east-1.amazonaws.com/artists/${imageKey}`;
//   };


export const getImageUrlReleases = (imageKey: string) => {
    // Asumimos que las imágenes están almacenadas en un bucket de S3 público
    const baseUrl = 'https://atkl.s3.us-east-1.amazonaws.com/releases/'; // Reemplazar <tu-bucket> con el nombre de tu bucket
    return `${baseUrl}${imageKey}`;
};