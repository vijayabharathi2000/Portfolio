import dns from 'node:dns'
import mongoose from 'mongoose'
import { env } from '../config/env.js'
import { logger } from '../utils/logger.js'

dns.setServers(['8.8.8.8', '1.1.1.1'])


export async function connectToDatabase(): Promise<void> {
  mongoose.set('strictQuery', true)

  try {
    await mongoose.connect(env.mongodbUri)
    logger.info('Connected to MongoDB')
  } catch (error) {
    logger.error('Failed to connect to MongoDB', error)
    throw error
  }
}

export async function disconnectFromDatabase(): Promise<void> {
  await mongoose.disconnect()
}
