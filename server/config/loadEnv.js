import dotenv from 'dotenv'
import { existsSync } from 'fs'
import { dirname, join, parse } from 'path'

/**
 * Había tres .env (raíz, server/, client/) y cuál ganaba dependía del cwd:
 * app.js y sequelize.js hacían dotenv.config() (lee el cwd) mientras index.js
 * cargaba ../.env. Resultado: server/.env tapaba a la raíz con placeholders.
 * Ahora todo el servidor lee UN solo archivo: el .env de la raíz del repo.
 *
 * La raíz se busca subiendo desde el cwd en vez de derivarla de
 * `import.meta.url`: babel-jest transforma estos módulos a CommonJS, donde
 * `import.meta` es un error de sintaxis y tiraba abajo tres suites de tests.
 * Esto funciona igual en ESM y en CJS.
 */
const encontrarRaiz = (desde = process.cwd()) => {
  let dir = desde
  const { root } = parse(dir)

  while (true) {
    // La raíz del repo es la que tiene el .env; si todavía no existe (CI, una
    // clonación limpia), sirve igual la que tiene client/ y server/.
    if (existsSync(join(dir, '.env'))) return dir
    if (existsSync(join(dir, 'client')) && existsSync(join(dir, 'server'))) return dir
    if (dir === root) return desde
    dir = dirname(dir)
  }
}

export const loadEnv = () => dotenv.config({ path: join(encontrarRaiz(), '.env') })
