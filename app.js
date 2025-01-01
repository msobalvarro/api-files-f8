import express from 'express'
import { router } from './route/index.js'

const app = express()
const PORT = 3001
// app.use(authenticateToken)

app.use('/', router)

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`)
})
