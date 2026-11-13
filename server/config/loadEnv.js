import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Había tres .env (raíz, server/, client/) y cuál ganaba dependía del cwd:
// app.js y sequelize.js hacían dotenv.config() (lee el cwd) mientras index.js
// cargaba ../.env. Resultado: server/.env tapaba a la raíz con placeholders.
// Ahora todo el servidor lee UN solo archivo: el .env de la raíz del repo.
export const loadEnv = () => dotenv.config({ path: join(__dirname, '..', '..', '.env') })
