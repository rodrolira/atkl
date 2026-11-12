import app from './app.js'
import sequelize from './db/sequelize.js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import './src/models/associations.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '..', '.env') })

if (!process.env.SECRET || process.env.SECRET === 'change-me-in-production') {
  console.error(
    'FATAL: SECRET no está configurado o tiene el valor por defecto. Define una SECRET segura en .env antes de iniciar.'
  )
  process.exit(1)
}

const isRender = process.env.RENDER === 'true'
const host = isRender ? '0.0.0.0' : 'localhost'

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Database synchronized')
    app.listen(process.env.PORT || 3000, host, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`)
    })
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error)
  })
