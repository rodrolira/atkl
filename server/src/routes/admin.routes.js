// admin.routes.js

import express from 'express'
import * as adminController from '../controllers/admin.controller.js'
import { verifyTokenAdmin } from '../middlewares/verifyTokenAdmin.js'

const router = express.Router()

router.get('/admin', verifyTokenAdmin, adminController.getAllAdminsHandler)

router.post('/admin/register', verifyTokenAdmin, adminController.createAdminHandler)

router.post('/admin/login', adminController.loginAdminHandler)

router.post('/admin/logout', adminController.logoutAdminHandler)

router.get('/admin/profile', verifyTokenAdmin, adminController.profileAdminHandler)

router.get('/admin/verify', verifyTokenAdmin, adminController.verifyAdminHandler)

router.delete('/admin/:username', verifyTokenAdmin, adminController.deleteAdminHandler)

export default router
