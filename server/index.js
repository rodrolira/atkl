import app from './app.js'
import sequelize from './db/sequelize.js'
import { loadEnv } from './config/loadEnv.js'
import './src/models/associations.js'

loadEnv()

if (!process.env.SECRET || process.env.SECRET === 'change-me' || process.env.SECRET === 'change-me-in-production') {
  console.error(
    'FATAL: SECRET no está configurado o tiene un valor inseguro. Define una SECRET segura y única en .env antes de iniciar.'
  )
  process.exit(1)
}

// En un contenedor (Render, Docker) hay que escuchar en 0.0.0.0: con
// 'localhost' el proceso arranca pero nadie de afuera lo alcanza, y las
// peticiones quedan colgadas sin error. Render define RENDER=true solo, pero
// render.yaml la fija explicita para no depender de eso.
const isRender = process.env.RENDER === 'true'
const inContainer = isRender || process.env.NODE_ENV === 'production'
const host = inContainer ? '0.0.0.0' : 'localhost'
const port = process.env.PORT || 3000

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Database synchronized')
    app.listen(port, host, () => {
      console.log(`Server is running on ${host}:${port}`)
    })
  })
  .catch((error) => {
    // Antes esto solo se logueaba: sin listen, el proceso quedaba vivo y mudo,
    // y la plataforma reportaba un deploy sano que colgaba cada petición.
    // Salir con código 1 hace que el fallo sea visible en el panel.
    console.error('FATAL: no se pudo conectar a la base de datos.')
    console.error(`  host: ${process.env.DATABASE_URL ? 'DATABASE_URL' : process.env.DB_HOST || '(sin configurar)'}`)
    console.error(`  ${error.name}: ${error.message}`)
    process.exit(1)
  })
