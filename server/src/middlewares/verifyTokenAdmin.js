// middleware/verifyTokenAdmin.js
import jwt from 'jsonwebtoken'

export const verifyTokenAdmin = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1]

  if (!token) {
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
