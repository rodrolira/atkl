// app.js
import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
// import http from "http";
import authRoutes from './routes/auth.routes.js'
import artistsRoutes from './routes/artists.routes.js'
import releasesRoutes from './routes/releases.routes.js'
import adminRoutes from './routes/admin.routes.js'
import genreRoutes from './routes/genre.routes.js'
import contactFormRoutes from './routes/contact-form.routes.js'
import rolesRouter from './routes/roles.routes.js'
import discographyRoutes from './routes/discography.routes.js'
import postgres from 'postgres'

dotenv.config()

const app = express()

// Middleware para servir archivos estáticos
app.use('/uploads', express.static('uploads'))

// app.use(
//   cors({
//       origin: 'https://atkl-react2-fzwl.vercel.app',
//     credentials: true,
//     exposedHeaders: 'Access-Control-Allow-Origin' // Agrega esta línea
//   })
// )
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT'], // Agrega DELETE aquí si es necesario
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

// Rutas públicas
app.use('/api', authRoutes)
app.use('/api', artistsRoutes)
app.use('/api', releasesRoutes)
app.use('/api', adminRoutes)
app.use('/api', contactFormRoutes)
app.use('/api', genreRoutes)
app.use('/api', rolesRouter)
  app.use('/api', discographyRoutes)

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.log(err)
  const status = err.status || 500
  const message = err.message || 'Something went wrong'
  res.status(status).send(message)
  next()
})

// Middleware para manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Page not found' })
})

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
})

async function getPgVersion() {
  const result = await sql`select version()`
  console.log(result)
}

getPgVersion()

export default app
