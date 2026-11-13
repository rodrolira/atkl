/**
 * Puebla la tabla `genres`. Necesario porque sequelize.sync() crea la tabla
 * vacía y los géneros venían de un bulkInsert en una migración que ya no se
 * puede correr (ver el comentario en config/config.js).
 *
 * Sin géneros, el formulario de "agregar release" del panel admin falla:
 * releaseService.addRelease exige genre_id.
 *
 *   node scripts/seed-generos.js
 */
import sequelize from '../db/sequelize.js'
import Genre from '../src/models/genre.model.js'

const GENEROS = [
  'Techno',
  'Hard Techno',
  'Industrial Techno',
  'Acid Techno',
  'Hardcore',
  'Hardcore Techno',
]

await sequelize.authenticate()

let creados = 0
for (const name of GENEROS) {
  const [, nuevo] = await Genre.findOrCreate({ where: { name }, defaults: { name } })
  console.log(`  ${nuevo ? '+' : '='} ${name}`)
  if (nuevo) creados++
}

console.log(`\n${creados} géneros creados, ${GENEROS.length - creados} ya existían.`)
await sequelize.close()
