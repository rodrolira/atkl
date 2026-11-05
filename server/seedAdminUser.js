import dotenv from 'dotenv'
import sequelize from './db/sequelize.js'
import Admin from './src/models/admin.model.js'
import User from './src/models/user.model.js'

dotenv.config()

const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env

if (!ADMIN_USERNAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Define ADMIN_USERNAME, ADMIN_EMAIL y ADMIN_PASSWORD en .env')
  process.exit(1)
}

try {
  const existing = await User.findOne({ where: { username: ADMIN_USERNAME } })
  if (existing) {
    console.log(`El usuario "${ADMIN_USERNAME}" ya existe con id ${existing.id}.`)
    process.exit(0)
  }

  const admin = await User.create({
    username: ADMIN_USERNAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: 'admin',
  })

  console.log(`Admin "${admin.username}" creado en tabla users con id ${admin.id} y rol '${admin.role}'.`)
} catch (error) {
  console.error('Error creando admin:', error.message)
  process.exit(1)
} finally {
  await sequelize.close()
}
