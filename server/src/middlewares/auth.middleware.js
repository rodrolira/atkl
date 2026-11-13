// middleware/auth.middleware.js
import jwt from 'jsonwebtoken'
import { loadEnv } from '../../config/loadEnv.js'

loadEnv()

export const authenticate = (requiredRole = null) => (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' })
      }
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if (requiredRole && decoded.role !== requiredRole) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' })
    }

    if (!decoded.userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    req.userId = decoded.userId
    req.userRole = decoded.role
    next()
  })
}

export const verifyTokenUser = authenticate('user')
export const verifyTokenAdmin = authenticate('admin')
export const verifyTokenAny = authenticate()
