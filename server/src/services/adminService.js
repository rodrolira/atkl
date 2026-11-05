import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const createToken = (userId) => {
  if (!userId) {
    throw new Error('userId is required')
  }
  return jwt.sign({ userId, role: 'admin' }, process.env.SECRET, { expiresIn: '1h' })
}

export const toPublicAdmin = (admin) => {
  if (!admin) return admin
  const plain = typeof admin.toJSON === 'function' ? admin.toJSON() : admin
  const { password, ...publicAdmin } = plain
  return publicAdmin
}

export const findAdmin = async (criteria) => User.findOne({ where: { ...criteria, role: 'admin' } })

export const createAdmin = async (adminData) => User.create({ ...adminData, role: 'admin' })

export const findAdminByEmail = async (email) => User.findOne({ where: { email, role: 'admin' } })

export const findAdminByUsername = async (username) =>
  User.findOne({ where: { username, role: 'admin' } })

export const getAllAdmins = async () => User.findAll({ where: { role: 'admin' } })

export const loginAdmin = async (username, password) => {
  const admin = await User.findOne({ where: { username, role: 'admin' } })
  if (!admin) throw new Error('Admin not found')

  const isMatch = await bcrypt.compare(password, admin.password)
  if (!isMatch) throw new Error('Invalid credentials')

  return { token: createToken(admin.id), admin }
}

export const profileAdmin = async (adminId) => {
  const admin = await User.findByPk(adminId)
  if (!admin) throw new Error('Admin not found')
  return admin
}

export const logoutAdmin = (res) => {
  res.clearCookie('token')
  res.status(200).json({ message: 'Logout successful' })
}

export const deleteAdmin = async (username) => {
  const admin = await User.findOne({ where: { username, role: 'admin' } })
  if (!admin) throw new Error('Admin not found')
  await admin.destroy()
  return { message: 'Admin deleted successfully' }
}
