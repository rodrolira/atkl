// Lista negra de JWT revocados (en memoria para MVP).
// Para producción, usar Redis o base de datos.
const revokedTokens = new Set()

export const revokeToken = (token) => revokedTokens.add(token)

export const isTokenRevoked = (token) => revokedTokens.has(token)

export const clearRevokedTokens = () => revokedTokens.clear()

export const middleware = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1]
  if (token && isTokenRevoked(token)) {
    return res.status(401).json({ message: 'Token revoked' })
  }
  next()
}
