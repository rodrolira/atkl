// user.routes.js

import express from 'express'
import * as userController from '../controllers/auth.controller.js'
import { verifyTokenUser } from '../middlewares/auth.middleware.js'
import { verifyTokenAdmin } from '../middlewares/verifyTokenAdmin.js'

const router = express.Router()

// Crear cuentas queda detrás de auth de admin: el producto no tiene registro
// público (las páginas de signup están desactivadas en el cliente) y este
// endpoint, abierto, dejaba que cualquiera llenara la tabla de usuarios. Las
// cuentas de artista se crean por su propio flujo (POST /artists, ya admin).
router.post('/register', verifyTokenAdmin, async (req, res) => {
  try {
    await userController.register(req, res)
  } catch (error) {
    console.error('Error registering user:', error)
    res.status(500).json({ message: 'Server Error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    await userController.login(req, res)
  } catch (error) {
    console.error('Error logging in user:', error)
    res.status(401).json({ message: 'Invalid credentials' })
  }
})

router.post('/logout', userController.logout)

router.get('/profile', verifyTokenUser, async (req, res) => {
  try {
    await userController.profile(req, res)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    res.status(500).json({ message: 'Server Error' })
  }
})

router.get('/verify', async (req, res) => {
  try {
    await userController.verify(req, res)
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' })
  }
})

export default router
