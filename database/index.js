import { connect } from 'mongoose'

export const dbConnection = async () => {
  const DB_URI = process.env.DB
  await connect(DB_URI)
}
