// admin.routes.js

import express from 'express'
import * as adminController from '../controllers/admin.controller.js'
import { verifyTokenAdmin } from '../middlewares/verifyTokenAdmin.js'

const router = express.Router()

router.post('/admin/register', async (req, res) => {
  try {
    const { username, email, password } = req.body
    const newAdmin = await adminController.createAdmin({
      username,
      email,
      password,
    })
    res
      .status(201)
      .json({ message: 'Admin registered successfully', admin: newAdmin })
  } catch (error) {
    console.error('Error registering admin:', error)
    res.status(500).json({ message: 'Server Error' })
  }
})

router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const token = await adminController.loginAdmin(username, password)
    const admin = await adminController.findAdminByUsername(username)

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo 'secure' en producción
      maxAge: 12 * 60 * 60 * 1000, // 12hrs
    })

    res.json({ message: 'Login successful', token, admin })
  } catch (error) {
    console.error('Error logging in admin:', error)
    res.status(401).json({ message: 'Invalid credentials' })
  }
})

router.post('/admin/logout', adminController.logoutAdmin)

router.get('/admin/profile', adminController.verifyTokenAdmin, async (req, res) => {
  try {
    const admin = await adminController.profileAdmin(req.adminId)
    res.json({ admin })
  } catch (error) {
    console.error('Error fetching admin profile:', error)
    res.status(500).json({ message: 'Server Error' })
  }
})

//router.get('/admin/verify', verifyTokenAdmin, (req, res) => {
//  res.status(200).json({ message: 'Token is valid', adminId: req.admin.id })
//})

router.get('/admin/verify', async (req, res) => {
  const { token } = req.cookies
  try {
    const admin = await adminController.verifyTokenAdmin(token)
    res.json({ admin })
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' })
  }
})
export default router
