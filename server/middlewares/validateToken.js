// middleware/validateToken.js

import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const verifyTokenAdmin = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET)
    req.adminId = decoded.adminId
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' })
    } else {
      console.error('Error verifying token:', error)
      return res.status(401).json({ message: 'Unauthorized' })
    }
  }
}
