import { Sequelize } from 'sequelize'
import { loadEnv } from '../config/loadEnv.js'

loadEnv()

const isRender = process.env.RENDER === 'true'
const useSsl = process.env.DB_SSL === 'true' || isRender

const sslOptions = { ssl: { require: true, rejectUnauthorized: false } }

// El SSL lo decide la propia cadena: Neon y Supabase la entregan con
// ?sslmode=require, y un Postgres local sin SSL se rompe si se le fuerza.
const url = process.env.DATABASE_URL
const urlNeedsSsl = Boolean(url) && /[?&]sslmode=(require|verify-full|verify-ca)/.test(url)

// Neon/Supabase entregan una sola cadena de conexión. Antes había que partirla
// en cinco variables a mano; ahora si DATABASE_URL existe, manda ella.
const sequelize = url
  ? new Sequelize(url, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: urlNeedsSsl || useSsl ? sslOptions : {},
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,
        dialectOptions: useSsl ? sslOptions : {},
      }
    )

export default sequelize
