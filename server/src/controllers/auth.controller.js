// user.controller.js

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../../models/user.model.js'
import dotenv from 'dotenv'
import prisma from '../prisma.js'

dotenv.config()

const createToken = (userId) => {
  return jwt.sign({ userId, role: 'user' }, process.env.SECRET, {
    expiresIn: '12h',
  })
}

export const createUser = async ({ username, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    })
    return newUser
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`)
  }
}

export const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ where: { email } })
    return user
  } catch (error) {
    throw new Error(`Error finding user by email: ${error.message}`)
  }
}

export const findUserByUsername = async (username) => {
  try {
    const user = await User.findOne({ where: { username } })
    return user
  } catch (error) {
    throw new Error(`Error finding user by username: ${error.message}`)
  }
}

export const loginUser = async (username, password) => {
  try {
    const user = await User.findOne({ where: { username } })

    if (!user) {
      throw new Error('User not found')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      throw new Error('Invalid credentials')
    }

    const token = createToken(user.id)

    return token
  } catch (error) {
    throw new Error(`Error logging in user: ${error.message}`)
  }
}

export const profileUser = async (userId) => {
  try {
    const user = await User.findByPk(userId, { attributes: ['id', 'username', 'email'] })
    if (!user) {
      throw new Error('User not found')
    }
    return user
  } catch (error) {
    throw new Error(`Error fetching user profile: ${error.message}`)
  }
}

export const verifyTokenUser = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET)
    if (decoded.role !== 'user') {
      throw new Error('Unauthorized')
    }

    const user = await User.findByPk(decoded.userId)

    if (!user) {
      throw new Error('Unauthorized')
    }

    return user
  } catch (error) {
    throw new Error('Unauthorized')
  }
}

export const logoutUser = (req, res) => {
  try {
    res.clearCookie('token')
    res.status(200).json({ message: 'Logged out successfully' })
  } catch (error) {
    res.status(500).json({ message: `Error logging out: ${error.message}` })
  }
}
