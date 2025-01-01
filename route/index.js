import dotenv from 'dotenv'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { Router } from 'express'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const router = Router()

const uploadDir = path.join(__dirname, process.env.PUBLIC_FOLDER)

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  },
})

const upload = multer({ storage })

router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No se ha subido ningún archivo.')
    }

    res.status(200).send({ fileName: req.file.filename })
  } catch (error) {
    res.status(500).send({
      message: 'Ocurrió un error al subir el archivo.',
      error: error.message,
    })
  }
})
