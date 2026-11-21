/**
 * Devuelve el mensaje de error a mostrar al cliente.
 *
 * Los controladores responden los errores con `error.message` directo, sin
 * pasar por el manejador global de app.js (que sí sanea los 5xx en producción).
 * Eso dejaba escapar mensajes crudos de Sequelize/Postgres en los 500 —p.ej.
 * `invalid input syntax for type integer` o `notNull Violation: ...`—, que
 * delatan el motor y el esquema. Son rutas de admin, pero igual no hay motivo
 * para filtrar internals.
 *
 * Regla: un 5xx en producción se generaliza; los 4xx (datos inválidos, no
 * encontrado) se dejan tal cual porque son mensajes pensados para el usuario, y
 * en desarrollo se deja todo para poder depurar.
 */
export const mensajeSeguro = (error) => {
  const status = error?.status || 500
  const esProduccion = process.env.NODE_ENV === 'production'
  if (status >= 500 && esProduccion) {
    return 'Internal server error'
  }
  return error?.message
}
