// index.js
import app from './app.js'
import sequelize from './db/sequelize.js'
import dotenv from 'dotenv'
import './src/models/associations.js'

const host = ('RENDER' in process.env) ? '0.0.0.0' : 'localhost'

dotenv.config()

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Database synchronized')
    // Iniciar el servidor aquí...
    app.listen(process.env.PORT || 3000, host, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error)
  })
