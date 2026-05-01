import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const isRender = process.env.RENDER === 'true'
const useSsl = process.env.DB_SSL === 'true' || isRender

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
    dialectOptions: useSsl
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      : {}
  }
)

export default sequelize
