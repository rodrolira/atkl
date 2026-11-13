// server/controllers/admin.controller.js
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Admin from '../models/admin.model.js'
import {
  createAdmin as createAdminService,
  loginAdmin as loginAdminService,
  profileAdmin as profileAdminService,
  logoutAdmin as logoutAdminService,
  deleteAdmin as deleteAdminService,
  getAllAdmins as getAllAdminsService,
  toPublicAdmin as toPublicAdminService,
} from '../services/adminService.js'

// --- Funciones puras (para tests y uso interno) ---

export const createToken = (adminId) => {
  if (!adminId) {
    throw new Error('adminId is required')
  }
  return jwt.sign({ adminId, role: 'admin' }, process.env.SECRET, { expiresIn: '1h' })
}

export const findAdmin = async (criteria) => Admin.findOne({ where: criteria })

export const findAdminByEmail = async (email) => {
  try {
    const admin = await Admin.findOne({ where: { email } })
    if (!admin) throw new Error('Admin not found')
    return admin
  } catch (error) {
    throw new Error(`Error finding admin by email: ${error.message}`)
  }
}

export const findAdminByUsername = async (username) => Admin.findOne({ where: { username } })

export const loginAdmin = async (username, password) => {
  try {
    const admin = await Admin.findOne({ where: { username } })
    if (!admin) throw new Error('Admin not found')
    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) throw new Error('Invalid credentials')
    return { token: createToken(admin.id), admin }
  } catch (error) {
    throw new Error(`Error logging in admin: ${error.message}`)
  }
}

export const createAdmin = async (adminData) => {
  try {
    return await Admin.create(adminData)
  } catch (error) {
    throw new Error(`Error creating admin: ${error.message}`)
  }
}

export const getAllAdmins = async () => Admin.findAll()

export const toPublicAdmin = (admin) => {
  if (!admin) return admin
  const plain = typeof admin.toJSON === 'function' ? admin.toJSON() : admin
  const { password, ...publicAdmin } = plain
  return publicAdmin
}

// --- Handlers de ruta (para Express) ---

export const createAdminHandler = async (req, res) => {
  try {
    const { username, email, password } = req.body
    const newAdmin = await createAdmin({ username, email, password })
    res.status(201).json({
      message: 'Admin registered successfully',
      admin: toPublicAdmin(newAdmin),
    })
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
}

export const loginAdminHandler = async (req, res) => {
  try {
    const { username, password } = req.body
    const { token, admin } = await loginAdmin(username, password)

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 12 * 60 * 60 * 1000,
    })

    res.json({
      message: 'Login successful',
      token,
      admin: toPublicAdmin(admin),
    })
  } catch (error) {
    res.status(401).json({ message: 'Invalid credentials' })
  }
}

export const logoutAdminHandler = (req, res) => {
  res.clearCookie('token')
  res.status(200).json({ message: 'Logout successful' })
}

export const profileAdminHandler = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.adminId)
    res.json({ admin: toPublicAdmin(admin) })
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
}

export const verifyAdminHandler = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.adminId)
    res.status(200).json({ admin: toPublicAdmin(admin) })
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

export const deleteAdminHandler = async (req, res) => {
  try {
    const { username } = req.params
    const admin = await Admin.findOne({ where: { username } })
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' })
    }
    await Admin.destroy({ where: { username } })
    res.status(200).json({ message: 'Admin deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting admin' })
  }
}

export const getAllAdminsHandler = async (req, res) => {
  try {
    const admins = await Admin.findAll()
    res.status(200).json({ admins: admins.map(toPublicAdmin) })
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
}

export default {
  createAdmin: createAdminHandler,
  loginAdmin: loginAdminHandler,
  logoutAdmin: logoutAdminHandler,
  profileAdmin: profileAdminHandler,
  verifyAdmin: verifyAdminHandler,
  deleteAdmin: deleteAdminHandler,
  getAllAdmins: getAllAdminsHandler,
}