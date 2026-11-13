import { loadEnv } from './loadEnv.js'

loadEnv()

// OJO: este archivo solo lo usa sequelize-cli. Las migraciones de server/migrations
// están desfasadas: no existe createTable para artists/genres/users/admins/roles/
// artist_roles/release_artists/discography, pero sí hay addColumn('artists', ...).
// Correr `sequelize db:migrate` en una BD vacía falla. El esquema real lo crea
// sequelize.sync() desde los modelos al arrancar (ver server/index.js).
const credentials = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: process.env.DB_PORT,
  url: process.env.DATABASE_URL,
}

export default {
  development: credentials,
  test: credentials,
  production: credentials,
}
