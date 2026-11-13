// app.js
import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { loadEnv } from './config/loadEnv.js'
import authRoutes from './src/routes/auth.routes.js'
import artistsRoutes from './src/routes/artists.routes.js'
import releasesRoutes from './src/routes/releases.routes.js'
import adminRoutes from './src/routes/admin.routes.js'
import genreRoutes from './src/routes/genre.routes.js'
import contactFormRoutes from './src/routes/contact-form.routes.js'
import rolesRouter from './src/routes/roles.routes.js'
import discographyRoutes from './src/routes/discography.routes.js'

loadEnv()

const app = express()
const isProduction = process.env.NODE_ENV === 'production'

// Detrás de Render/Vercel hace falta confiar en el proxy para que el rate limit
// vea la IP real del cliente y no la del balanceador.
app.set('trust proxy', 1)

// --- Cabeceras de seguridad (ANTES de las rutas; si van después nunca se aplican) ---
// Esta es una API JSON: no lleva CSP de documento ni Clear-Site-Data (esa cabecera
// borraba el localStorage del cliente en cada respuesta).
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'no-referrer')
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none')
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site')
  next()
})

// Lista de orígenes permitidos producción y desarrollo
const allowedOrigins = [
  'http://localhost:5173',
  'https://atkl.vercel.app',
  'https://atkl.onrender.com',
  'http://localhost:42423',
]

app.use(
  cors({
    origin: (origin, callback) => {
      // Sin Origin (navegación directa, health check de Render, curl) se deja
      // pasar: no es una petición cross-site de navegador. Con Origin, solo los
      // de la lista reciben cabeceras CORS; al resto el navegador le bloquea la
      // respuesta. No lanzamos error para no devolver 500 en cada health check.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      return callback(null, false)
    },
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Type', 'Authorization'],
  })
)

if (!isProduction) {
  app.use(morgan('dev'))
}

app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())

// --- Rate limiting ---
// Login/registro: freno a fuerza bruta de credenciales.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Demasiados intentos. Intenta de nuevo más tarde.' },
})

// Formulario de contacto: evita que el endpoint se use como relay de spam.
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Demasiados envíos. Intenta de nuevo más tarde.' },
})

// Límite general de la API como red de seguridad.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 600,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
})

app.use('/api/login', authLimiter)
app.use('/api/register', authLimiter)
app.use('/api/admin/login', authLimiter)
app.use('/api/admin/register', authLimiter)
app.use('/api/submit-form', contactLimiter)
app.use('/api', apiLimiter)

// Rutas públicas
app.use('/api', authRoutes)
app.use('/api', artistsRoutes)
app.use('/api', releasesRoutes)
app.use('/api', adminRoutes)
app.use('/api', contactFormRoutes)
app.use('/api', genreRoutes)
app.use('/api', rolesRouter)
app.use('/api', discographyRoutes)

app.get('/', (req, res) => {
  res.send('Home Page')
})

// Middleware para manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Page not found' })
})

// Middleware para manejar errores: en producción no exponemos el mensaje
// interno (puede filtrar detalles de Sequelize/Postgres).
app.use((err, req, res, next) => {
  const status = err.status || 500
  console.error('[error]', req.method, req.originalUrl, err.message)

  const message = isProduction && status >= 500 ? 'Internal server error' : err.message

  res.status(status).json({ error: { message } })
})

export default app
