import { z } from 'zod'

/**
 * Validación de los datos de artista que llegan por POST y PUT /artists.
 *
 * Los dos endpoints reciben multipart (pasan por multer para la imagen), así
 * que TODO llega como string: no hay números ni arrays, y un campo que el
 * formulario dejó vacío llega como "" y no como ausente. Eso importa porque
 * `artist_name` y `email` son NOT NULL en la base pero "" no es null: antes
 * un nombre vacío se guardaba con 200 y dejaba el artista sin nombre.
 *
 * Zod descarta las claves que no estén declaradas acá, así que lo que el
 * cliente mande de más no llega al modelo.
 */

const texto = z.string().trim()

/** Link opcional: o es una URL válida o directamente no vino. */
const link = z
  .union([texto.url('Tiene que ser una URL válida'), z.literal('')])
  .optional()
  .transform((v) => (v === '' ? undefined : v))

const LINKS = [
  'bandcamp_link',
  'facebook_link',
  'instagram_link',
  'soundcloud_link',
  'twitter_link',
  'youtube_link',
  'spotify_link',
  'apple_music_link',
  'beatport_link',
]

const camposLink = Object.fromEntries(LINKS.map((nombre) => [nombre, link]))

/**
 * Los roles llegan como "1,2" desde FormData, o como array si algún cliente
 * manda JSON. Se normaliza a number[] para que el servicio no tenga que
 * adivinar.
 */
const roleIds = z
  .union([texto, z.array(z.union([z.string(), z.number()]))])
  .optional()
  .transform((valor) => {
    if (valor === undefined || valor === '') return undefined
    const crudos = Array.isArray(valor) ? valor : String(valor).split(',')
    return crudos
      .map((id) => parseInt(String(id).trim(), 10))
      .filter((id) => !Number.isNaN(id))
  })

const base = {
  artist_name: texto.min(1, 'El nombre del artista es obligatorio'),
  email: texto.min(1, 'El correo es obligatorio').email('El correo no es válido'),
  bio: texto.optional(),
  // La pone el servidor con la URL que devuelve Cloudinary, no el cliente.
  image: texto.optional(),
  username: texto.optional(),
  password: texto.optional(),
  roleIds,
  ...camposLink,
}

export const crearArtistaSchema = z.object(base)

/**
 * En una edición alcanza con mandar los campos que cambian, pero el que venga
 * tiene que ser válido igual: `artist_name: ""` sigue siendo un error.
 */
export const actualizarArtistaSchema = z.object(base).partial()

/**
 * Devuelve los datos ya normalizados o lanza un error con status 400 y el
 * detalle por campo, para que la ruta no tenga que repetir el formateo.
 */
export const validarArtista = (schema, datos) => {
  const resultado = schema.safeParse(datos)
  if (resultado.success) return resultado.data

  const errores = resultado.error.issues.map((issue) => ({
    campo: issue.path.join('.'),
    mensaje: issue.message,
  }))

  const error = new Error(errores.map((e) => `${e.campo}: ${e.mensaje}`).join('; '))
  error.status = 400
  error.errores = errores
  throw error
}
