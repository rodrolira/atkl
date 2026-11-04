import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Admin from '../models/admin.model.js'

export const createToken = (adminId) => {
  if (!adminId) {
    throw new Error('adminId is required')
  }

  const payload = {
    adminId: adminId,
    role: 'admin',
  }

  return jwt.sign(payload, process.env.SECRET, { expiresIn: '1h' })
}

export const toPublicAdmin = (admin) => {
  if (!admin) return admin
  const plain = typeof admin.toJSON === 'function' ? admin.toJSON() : admin
  const { password, ...publicAdmin } = plain
  return publicAdmin
}

export const findAdmin = async (criteria) => {
  return await Admin.findOne({ where: criteria })
}

export const createAdmin = async (adminData) => {
  return await Admin.create(adminData)
}

export const findAdminByEmail = async (email) => {
  const admin = await Admin.findOne({ where: { email } })
  if (!admin) {
    throw new Error('Admin not found')
  }
  return admin
}

export const findAdminByUsername = async (username) => {
  const admin = await Admin.findOne({ where: { username } })
  if (!admin) {
    throw new Error('Admin not found')
  }
  return admin
}

export const getAllAdmins = async () => {
  return await Admin.findAll()
}

export const loginAdmin = async (username, password) => {
  const admin = await Admin.findOne({ where: { username } })
  if (!admin) {
    throw new Error('Admin not found')
  }

  const isMatch = await bcrypt.compare(password, admin.password)
  if (!isMatch) {
    throw new Error('Invalid credentials')
  }

  const token = createToken(admin.id)
  return { token, admin }
}

export const profileAdmin = async (adminId) => {
  const admin = await Admin.findByPk(adminId)
  if (!admin) {
    throw new Error('Admin not found')
  }
  return admin
}

export const logoutAdmin = (res) => {
  res.clearCookie('token')
  res.status(200).json({ message: 'Logout successful' })
}

export const deleteAdmin = async (username) => {
  const admin = await Admin.findOne({ where: { username } })
  if (!admin) {
    const error = new Error('Admin not found')
    error.status = 404
    throw error
  }
  await Admin.destroy({ where: { username } })
  return { message: 'Admin deleted successfully' }
}
