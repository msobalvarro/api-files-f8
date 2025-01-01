import dotenv from 'dotenv'
import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { fileURLToPath } from 'url'

dotenv.config()

// Define __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3001

const { SECRET_KEY } = process.env

const authenticateToken = (req, res, next) => {
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

const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../uploads')
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  }
})

const upload = multer({ storage })

app.use(authenticateToken)

app.post('/files', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No se ha subido ningún archivo.')
    }

    res.status(200).send({
      message: 'Archivo subido con éxito.',
      fileName: req.file.filename,
    })
  } catch (error) {
    res.status(500).send({
      message: 'Ocurrió un error al subir el archivo.',
      error: error.message,
    })
  }
})

app.use('/uploads', express.static('uploads'))

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`)
})
