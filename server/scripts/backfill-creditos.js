/**
 * Completa `releases.artist_credit` para los discos que quedaron sin crédito.
 *
 *   node scripts/backfill-creditos.js            # dry run: muestra y NO escribe
 *   node scripts/backfill-creditos.js --commit   # escribe en la BD
 *
 * Por qué hace falta: borrar un artista desde el panel destruía las filas de
 * ReleaseArtists, así que el release perdía a quién pertenecía y mostraba
 * "sin artistas". El nombre ya no está en la base, pero sí en Bandcamp, que es
 * de donde salió el catálogo.
 *
 * El crédito se busca en dos lugares, en este orden:
 *   1. La ficha de artista todavía vinculada, si quedó alguna.
 *   2. El campo `artist` del release en Bandcamp.
 *
 * Nunca pisa un artist_credit que ya tenga valor.
 *
 * También agrega la columna si falta: sequelize.sync({force:false}) crea tablas
 * nuevas pero NO agrega columnas a una tabla que ya existe, y las migraciones
 * de este repo no se pueden correr (ver el comentario en config/config.js).
 */
import sequelize from '../db/sequelize.js'
import Release from '../src/models/release.model.js'
import Artist from '../src/models/artist.model.js'
import '../src/models/associations.js'
import { leerRelease } from './importar-bandcamp.js'

const COMMIT = process.argv.includes('--commit')

await sequelize.authenticate()

// IF NOT EXISTS lo hace idempotente: se puede correr varias veces sin romper.
await sequelize.query(
  'ALTER TABLE releases ADD COLUMN IF NOT EXISTS artist_credit VARCHAR(255)'
)
console.log('columna artist_credit: lista\n')

const releases = await Release.findAll({
  include: [{ model: Artist, as: 'artists' }],
  order: [['id', 'ASC']],
})

let desdeFicha = 0
let desdeBandcamp = 0
let sinResolver = 0
let yaTenian = 0

for (const r of releases) {
  if (r.artist_credit) {
    console.log(`  = ya tenía  "${r.title}" -> ${r.artist_credit}`)
    yaTenian++
    continue
  }

  let credito = null
  let origen = null

  if (r.artists?.length > 0) {
    credito = r.artists.map((a) => a.artist_name).join(' & ')
    origen = 'ficha'
  } else if (r.bandcamp_link) {
    try {
      const d = await leerRelease(r.bandcamp_link)
      credito = d.artista
      origen = 'bandcamp'
    } catch (e) {
      console.log(`  ! error leyendo "${r.title}": ${e.message.slice(0, 70)}`)
    }
  }

  if (!credito) {
    console.log(`  ? sin resolver "${r.title}"`)
    sinResolver++
    continue
  }

  console.log(`  + ${origen.padEnd(8)} "${r.title}" -> ${credito}`)
  if (origen === 'ficha') desdeFicha++
  else desdeBandcamp++

  if (COMMIT) await r.update({ artist_credit: credito })
}

console.log(
  `\n${desdeFicha} desde la ficha, ${desdeBandcamp} desde Bandcamp, ` +
    `${yaTenian} ya tenían, ${sinResolver} sin resolver.`
)
if (!COMMIT) console.log('\nDRY RUN: no se escribió nada. Usá --commit para aplicar.')

await sequelize.close()
