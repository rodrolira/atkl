// admin.routes.js

import express from 'express'
import * as adminController from '../controllers/admin.controller.js'
import { verifyTokenAdmin } from '../middlewares/verifyTokenAdmin.js'

const router = express.Router()

router.get('/admin', verifyTokenAdmin, async (req, res) => {
  try {
    const admins = await adminController.getAllAdmins();
    res.status(200).json({ admins: admins.map(adminController.toPublicAdmin) });
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/admin/register', verifyTokenAdmin, async (req, res) => {
  try {
    const { username, email, password } = req.body
    const newAdmin = await adminController.createAdmin({
      username,
      email,
      password,
    })
    res.status(201).json({
      message: 'Admin registered successfully',
      admin: adminController.toPublicAdmin(newAdmin),
    })
  } catch (error) {
    console.error('Error registering admin:', error)
    res.status(500).json({ message: 'Server Error' })
  }
})

router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const { token, admin } = await adminController.loginAdmin(username, password);

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 12 * 60 * 60 * 1000, // 12hrs
    })

    res.json({
      message: 'Login successful',
      token,
      admin: adminController.toPublicAdmin(admin),
    })
  } catch (error) {
    console.error('Error logging in admin:', error)
    res.status(401).json({ message: 'Invalid credentials' })
  }
})

router.post('/admin/logout', adminController.logoutAdmin)

router.get('/admin/profile', verifyTokenAdmin, async (req, res) => {
  try {
    const admin = await adminController.profileAdmin(req.adminId)
    res.json({ admin: adminController.toPublicAdmin(admin) })
  } catch (error) {
    console.error('Error fetching admin profile:', error)
    res.status(500).json({ message: 'Server Error' })
  }
})

router.get('/admin/verify', verifyTokenAdmin, async (req, res) => {
  try {
    const admin = await adminController.profileAdmin(req.adminId)
    res.status(200).json({ admin: adminController.toPublicAdmin(admin) })
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' })
  }
})

router.delete('/admin/:username', verifyTokenAdmin, adminController.deleteAdmin)

export default router
