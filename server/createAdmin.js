import { loadEnv } from './config/loadEnv.js'
import sequelize from './db/sequelize.js'
import Admin from './src/models/admin.model.js'

loadEnv()

const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env

if (!ADMIN_USERNAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    'Define ADMIN_USERNAME, ADMIN_EMAIL y ADMIN_PASSWORD para crear el admin.'
  )
  process.exit(1)
}

try {
  const existing = await Admin.findOne({ where: { username: ADMIN_USERNAME } })

  if (existing) {
    console.error(`El admin "${ADMIN_USERNAME}" ya existe.`)
    process.exitCode = 1
  } else {
    const admin = await Admin.create({
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    })
    console.log(`Admin "${admin.username}" creado con id ${admin.id}.`)
  }
} catch (error) {
  console.error('Error creando admin:', error.message)
  process.exitCode = 1
} finally {
  await sequelize.close()
}
