/**
 * Envuelve a multer para que una subida fallida no termine en un 500 pelado.
 *
 * multer corre como middleware, antes del handler de la ruta: si Cloudinary
 * rechaza el archivo (credenciales que no coinciden, formato no permitido, la
 * red), el error se va directo al manejador global de app.js y el panel recibe
 * un 500 sin nada que explique qué pasó. El caso real: `api_secret mismatch`
 * devolvía "Invalid Signature ..." y en el formulario solo se veía el texto
 * de respaldo.
 *
 * 502 y no 500 porque el que falló es un servicio de afuera, no esta API; es
 * el mismo código que ya se usa cuando el storage no devuelve URL.
 */
export const subirImagen = (upload, campo) => (req, res, next) =>
  upload.single(campo)(req, res, (error) => {
    if (!error) {
      return next()
    }

    error.status = error.status ?? 502
    error.message = `No se pudo subir la imagen: ${error.message}`
    next(error)
  })
