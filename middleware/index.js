
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

const { SECRET_KEY } = process.env

export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']

  console.log(token)

  if (!token) {
    return res.status(401).send({ message: 'token is required.' })
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).send({ message: 'Token no válido.' })
    }
    req.user = user
    next()
  })
}