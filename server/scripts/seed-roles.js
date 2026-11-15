/**
 * Puebla la tabla `roles`. Misma historia que los géneros: sequelize.sync()
 * crea la tabla vacía y los roles venían de un bulkInsert en una migración que
 * ya no se puede correr (ver el comentario en config/config.js).
 *
 * Sin roles, el formulario de "agregar artista" del panel admin queda con el
 * desplegable vacío y no se puede guardar: roleIds tiene Yup.array().min(1).
 *
 * Las etiquetas van en inglés para no romper la convención de `genres`
 * ('Techno', 'Hard Techno'): la columna es un STRING único, sin traducción.
 *
 *   node scripts/seed-roles.js
 */
import sequelize from '../db/sequelize.js'
import Role from '../src/models/role.model.js'

const ROLES = ['DJ', 'Producer']

await sequelize.authenticate()

let creados = 0
for (const label of ROLES) {
  const [, nuevo] = await Role.findOrCreate({ where: { label }, defaults: { label } })
  console.log(`  ${nuevo ? '+' : '='} ${label}`)
  if (nuevo) creados++
}

console.log(`\n${creados} roles creados, ${ROLES.length - creados} ya existían.`)
await sequelize.close()
