import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const createToken = (userId) => {
  return jwt.sign({ userId, role: 'user' }, process.env.SECRET, {
    expiresIn: '12h',
  })
}

export const createUser = async ({ username, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10)
  return await User.create({
    username,
    email,
    password: hashedPassword,
  })
}

export const findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } })
}

export const findUserByUsername = async (username) => {
  return await User.findOne({ where: { username } })
}

export const loginUser = async (username, password) => {
  const user = await User.findOne({ where: { username } })
  if (!user) {
    throw new Error('User not found')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('Invalid credentials')
  }

  return createToken(user.id)
}

export const profileUser = async (userId) => {
  const user = await User.findByPk(userId, { attributes: ['id', 'username', 'email'] })
  if (!user) {
    throw new Error('User not found')
  }
  return user
}

export const verifyTokenUser = async (token) => {
  const decoded = jwt.verify(token, process.env.SECRET)
  if (decoded.role !== 'user') {
    throw new Error('Unauthorized')
  }

  const user = await User.findByPk(decoded.userId)
  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
}
