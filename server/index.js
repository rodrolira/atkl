import app from './app.js'
import sequelize from './db/sequelize.js'
import dotenv from 'dotenv'
import './src/models/associations.js'

dotenv.config()

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
