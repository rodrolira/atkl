/**
 * Importa el catálogo del sello desde Bandcamp a la base de datos.
 *
 *   node scripts/importar-bandcamp.js            # dry run: muestra y NO escribe
 *   node scripts/importar-bandcamp.js --commit   # escribe en la BD
 *
 * Ni el audio ni las portadas se descargan: Bandcamp los sirve desde su CDN y
 * la BD guarda solo la URL/el ID. Por eso el dry run funciona sin DATABASE_URL.
 *
 * Lo que NO se puede sacar de Bandcamp y queda en null: genre_id y los links de
 * Spotify/Beatport/Apple/YouTube. Se completan desde el panel admin.
 */
const LABEL = 'https://atklrecords.bandcamp.com'
const UA = 'atkl-site-importer/1.0 (+https://atklrecords.bandcamp.com)'

const get = async (url) => {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`HTTP ${res.status} en ${url}`)
  return res.text()
}

const unescapeHtml = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

/** Saca las URLs de cada release del listado /music del sello. */
export const listarReleases = async () => {
  const html = await get(`${LABEL}/music`)
  const paths = [...new Set(html.match(/\/(album|track)\/[a-z0-9-]+/g) || [])]
  return paths.map((p) => `${LABEL}${p}`)
}

/**
 * Bandcamp incrusta el release completo como JSON en data-tralbum, así que no
 * hace falta parsear HTML ni una librería de scraping.
 */
export const leerRelease = async (url) => {
  const html = await get(url)
  const raw = html.match(/data-tralbum="(.*?)"/s)
  if (!raw) throw new Error(`sin data-tralbum: ${url}`)
  const d = JSON.parse(unescapeHtml(raw[1]))

  const cover = html.match(/og:image" content="([^"]+)"/)
  const tracks = d.trackinfo || []
  const titulo = d.current?.title || d.album_title || '(sin título)'

  return {
    url,
    bandcamp_album_id: String(d.id),
    title: titulo,
    artista: d.artist || null,
    release_type: tipoDeRelease(titulo, d.item_type, tracks.length),
    release_date: d.album_release_date || d.current?.release_date || null,
    description: d.current?.about || null,
    // _10 es la versión de 1200px; el og:image trae _5 (700px).
    cover_image_url: cover ? cover[1].replace(/_\d+\.jpg$/, '_10.jpg') : null,
    n_tracks: tracks.length,
    tracks: tracks.map((t) => t.title),
  }
}

/** El enum del modelo es Album | EP | Single | V.A | Compilation. */
const tipoDeRelease = (titulo, itemType, nTracks) => {
  if (/\bv\.?\s?a\b/i.test(titulo)) return 'V.A'
  if (itemType === 'track' || nTracks === 1) return 'Single'
  if (nTracks <= 4) return 'EP'
  return 'Album'
}

/** `node scripts/importar-bandcamp.js --check` — no toca la red ni la BD. */
const autochequeo = async () => {
  const { strict: assert } = await import('node:assert')

  assert.equal(tipoDeRelease('UNKNOWN VA I', 'album', 10), 'V.A')
  assert.equal(tipoDeRelease("TRICK OR TREAT - VA 'HALLOWEEN'", 'album', 7), 'V.A')
  assert.equal(tipoDeRelease('Crying', 'track', 1), 'Single')
  assert.equal(tipoDeRelease('Noesis', 'album', 2), 'EP')
  assert.equal(tipoDeRelease('The Orders', 'album', 3), 'EP')
  assert.equal(tipoDeRelease('High Voltage', 'album', 6), 'Album')
  // Un álbum de un solo track es un Single, no un EP.
  assert.equal(tipoDeRelease('Old World', 'album', 1), 'Single')
  // "Nevada" contiene "va" pero no es un V.A: el \b evita el falso positivo.
  assert.equal(tipoDeRelease('Nevada Nights', 'album', 8), 'Album')

  const enumDelModelo = ['Album', 'EP', 'Single', 'V.A', 'Compilation']
  for (const t of ['V.A', 'Single', 'EP', 'Album']) {
    assert.ok(enumDelModelo.includes(t), `${t} no está en el enum de release_type`)
  }

  assert.equal(unescapeHtml('&quot;a&amp;b&quot;'), '"a&b"')

  console.log('autochequeo OK')
}

const main = async () => {
  if (process.argv.includes('--check')) return autochequeo()

  const commit = process.argv.includes('--commit')

  const urls = await listarReleases()
  console.log(`${urls.length} releases en ${LABEL}/music\n`)

  const releases = []
  for (const url of urls) {
    try {
      const r = await leerRelease(url)
      releases.push(r)
      console.log(
        `  ${r.release_type.padEnd(10)} ${r.title}\n` +
          `    artista: ${r.artista ?? '—'}  | album_id: ${r.bandcamp_album_id}  | tracks: ${r.n_tracks}\n` +
          `    portada: ${r.cover_image_url ?? '—'}\n` +
          `    tracks:  ${r.tracks.join(' · ') || '—'}`
      )
    } catch (e) {
      console.error(`  !! ${url}: ${e.message}`)
    }
  }

  console.log(`\n${'='.repeat(70)}`)
  console.log(`${releases.length}/${urls.length} releases leídos correctamente.`)
  console.log('genre_id y los links de Spotify/Beatport/Apple/YouTube quedan en null.')

  if (!commit) {
    console.log('\nDRY RUN — no se escribió nada. Corré con --commit para insertar.')
    return
  }

  // Los modelos se importan recién acá: así el dry run no necesita la BD.
  const { default: sequelize } = await import('../db/sequelize.js')
  await import('../src/models/associations.js')
  const { default: Release } = await import('../src/models/release.model.js')
  const { default: Artist } = await import('../src/models/artist.model.js')

  await sequelize.authenticate()
  console.log('\nConectado a la BD. Insertando...\n')

  let creados = 0
  let saltados = 0
  let actualizados = 0
  for (const r of releases) {
    // Idempotente: si el album_id ya está, no se duplica. Permite re-correr.
    const existe = await Release.findOne({
      where: { bandcamp_album_id: r.bandcamp_album_id },
    })
    if (existe) {
      // Solo se refrescan los campos que vienen de Bandcamp. Nunca se tocan
      // genre_id ni los links de Spotify/Beatport: esos se editan a mano en el
      // panel y re-correr el import no debe pisarlos.
      if (existe.bandcamp_track_count !== r.n_tracks) {
        await existe.update({ bandcamp_track_count: r.n_tracks })
        console.log(`  ~ actualizado (${r.n_tracks} tracks): ${r.title}`)
        actualizados++
      } else {
        console.log(`  = sin cambios: ${r.title}`)
        saltados++
      }
      continue
    }

    const nuevo = await Release.create({
      title: r.title,
      release_date: r.release_date ? new Date(r.release_date) : null,
      description: r.description,
      release_type: r.release_type,
      cover_image_url: r.cover_image_url,
      bandcamp_link: r.url,
      bandcamp_album_id: r.bandcamp_album_id,
      bandcamp_track_count: r.n_tracks,
    })

    if (r.artista) {
      // El modelo Artist exige email (allowNull: false). Bandcamp no lo da, así
      // que va un placeholder en el TLD .invalid (reservado por la RFC 2606
      // justo para esto) y se corrige desde el panel admin.
      const [artista] = await Artist.findOrCreate({
        where: { artist_name: r.artista },
        defaults: {
          artist_name: r.artista,
          email: `${r.artista.toLowerCase().replace(/[^a-z0-9]+/g, '-')}@placeholder.invalid`,
        },
      })
      await nuevo.setArtists([artista.id])
    }

    console.log(`  + ${r.title}`)
    creados++
  }

  console.log(`\n${creados} creados, ${actualizados} actualizados, ${saltados} sin cambios.`)
  await sequelize.close()
}

main().catch((e) => {
  console.error('\nFALLÓ:', e.message)
  process.exit(1)
})
