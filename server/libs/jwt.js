import jwt from 'jsonwebtoken'
import { loadEnv } from '../config/loadEnv.js'

loadEnv()

export function createAccessToken (payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' }, (err, token) => {
      if (err) reject(err)
      resolve(token)
    })
  })
}
