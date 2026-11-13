import { loadEnv } from './loadEnv.js'

loadEnv()

// OJO: este archivo solo lo usa sequelize-cli. Las migraciones de server/migrations
// están desfasadas: no existe createTable para artists/genres/users/admins/roles/
// artist_roles/release_artists/discography, pero sí hay addColumn('artists', ...).
// Correr `sequelize db:migrate` en una BD vacía falla. El esquema real lo crea
// sequelize.sync() desde los modelos al arrancar (ver server/index.js).
const url = process.env.DATABASE_URL
const needsSsl =
  Boolean(url) && /[?&]sslmode=(require|verify-full|verify-ca)/.test(url)

const credentials = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: process.env.DB_PORT,
  url,
  // sequelize-cli no interpreta el sslmode= de la cadena, solo dialectOptions:
  // sin esto Neon rechaza con "connection is insecure (try using sslmode=require)"
  // y ningun comando de migracion llega a conectar.
  ...(needsSsl || process.env.DB_SSL === 'true'
    ? { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } }
    : {}),
}

export default {
  development: credentials,
  test: credentials,
  production: credentials,
}
