// Caché en memoria para respuestas GET (MVP). En producción usar Redis.
const cache = new Map()

const CACHE_TTL_MS = 60 * 1000 // 1 minuto

export const cacheMiddleware = (keyPrefix, ttlMs = CACHE_TTL_MS) => (req, res, next) => {
  const key = `${keyPrefix}:${req.originalUrl}`
  const cached = cache.get(key)

  if (cached && Date.now() - cached.timestamp < ttlMs) {
    return res.json(cached.data)
  }

  // Interceptar la respuesta para cachearla
  const originalSend = res.send
  res.send = function (data) {
    if (res.statusCode === 200) {
      try {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data
        cache.set(key, { data: parsed, timestamp: Date.now() })
      } catch (e) {
        // No cachear si no es JSON válido
      }
    }
    return originalSend.call(this, data)
  }

  next()
}

export const clearCache = () => cache.clear()

export const getCache = (key) => cache.get(key)
