import dotenv from 'dotenv'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { Router } from "express"
import { fileURLToPath } from 'url'

dotenv.config()

// Define __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const router = Router()

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

const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}


router.post('/', upload.single('file'), (req, res) => {
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
