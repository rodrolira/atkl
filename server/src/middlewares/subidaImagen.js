import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../../config/cloudinary.js'

const FORMATOS = ['jpg', 'jpeg', 'png', 'gif', 'webp']

const crearUpload = (carpeta) =>
  multer({
    storage: new CloudinaryStorage({
      cloudinary,
      params: {
        folder: carpeta,
        allowed_formats: FORMATOS,
        public_id: (req, file) => `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`,
        // El preset por defecto de las subidas firmadas de la cuenta tiene
        // `async: true`. Con eso Cloudinary contesta { status: 'pending' } y
        // sin URL: multer-storage-cloudinary deja `path` vacío y la ruta
        // cortaba con 502 "el almacenamiento no devolvió una URL" aunque la
        // imagen después apareciera. Mandarlo explícito le gana al preset,
        // así la subida no depende de un toggle del panel de Cloudinary.
        async: false,
      },
    }),
  })

/**
 * Sube un archivo y traduce un fallo de la subida a 502.
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
export const subirImagen = (carpeta, campo) => {
  const upload = crearUpload(carpeta)

  return (req, res, next) =>
    upload.single(campo)(req, res, (error) => {
      if (!error) {
        return next()
      }

      error.status = error.status ?? 502
      error.message = `No se pudo subir la imagen: ${error.message}`
      next(error)
    })
}
