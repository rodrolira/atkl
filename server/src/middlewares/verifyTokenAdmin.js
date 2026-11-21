// middleware/verifyTokenAdmin.js
import jwt from 'jsonwebtoken'
import { isTokenRevoked } from './tokenBlacklist.js'

export const verifyTokenAdmin = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  // Un token al que se le hizo logout no vale aunque siga sin vencer. Sin esto,
  // cerrar sesión solo borraba la cookie: el mismo JWT seguía abriendo el panel
  // hasta expirar (1h). Ver tokenBlacklist.js.
  if (isTokenRevoked(token)) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err || decoded.role !== 'admin' || !decoded.adminId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    req.adminId = decoded.adminId
    next()
  })
}
