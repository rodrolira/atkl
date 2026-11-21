/**
 * Valida que un parámetro de ruta sea un entero positivo ANTES de que llegue a
 * Sequelize.
 *
 * Los id de la base son enteros autoincrementales. Sin esta barrera, un
 * `GET /api/releases/notanumber` pasaba "notanumber" a `findByPk`, Postgres
 * contestaba `invalid input syntax for type integer: "notanumber"` y ese error
 * crudo viajaba al cliente (los controladores responden con `error.message`
 * directo, sin pasar por el manejador global que sí sanea en producción). Es
 * fuga de información: delata motor, tipos de columna y versión.
 *
 * Validar acá lo corta de raíz para TODAS las rutas /:id a la vez, y de paso
 * devuelve un 400 honesto ("id inválido") en lugar de un 500.
 *
 * @param {string} nombre - nombre del parámetro (por defecto 'id')
 */
export const validarIdNumerico = (nombre = 'id') => (req, res, next) => {
  const valor = req.params[nombre]
  // Enteros positivos sin signo ni decimales. `Number.isSafeInteger` descarta
  // notaciones raras (1e9, 0x1f) que parseInt aceptaría a medias.
  if (!/^\d+$/.test(valor) || !Number.isSafeInteger(Number(valor)) || Number(valor) < 1) {
    return res.status(400).json({ message: 'id inválido' })
  }
  next()
}
