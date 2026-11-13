// user.routes.js

import express from 'express'
import * as userController from '../controllers/auth.controller.js'
import { verifyTokenUser } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/register', async (req, res) => {
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
