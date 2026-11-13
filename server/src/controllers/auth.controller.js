// server/controllers/auth.controller.js
import {
  createUser as createUserService,
  loginUser as loginUserService,
  profileUser as profileUserService,
  verifyTokenUser as verifyTokenUserService,
} from '../services/authService.js'

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body
    const newUser = await createUserService({ username, email, password })
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
}

export const login = async (req, res) => {
  try {
    const { username, password } = req.body
    const token = await loginUserService(username, password)

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 12 * 60 * 60 * 1000,
    })

    res.json({ message: 'Login successful', user: { username } })
  } catch (error) {
    res.status(401).json({ message: 'Invalid credentials' })
  }
}

export const logout = (req, res) => {
  res.clearCookie('token')
  res.status(200).json({ message: 'Logged out successfully' })
}

export const profile = async (req, res) => {
  try {
    const user = await profileUserService(req.userId)
    res.json({ user })
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
}

export const verify = async (req, res) => {
  const { token } = req.cookies
  try {
    const user = await verifyTokenUserService(token)
    res.json({ user })
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' })
  }
}
