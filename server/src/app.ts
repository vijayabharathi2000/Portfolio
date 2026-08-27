import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from './config/env.js'
import { requestLogger } from './middleware/requestLogger.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import { publicRoutes } from './routes/publicRoutes.js'
import { authRoutes } from './routes/authRoutes.js'
import { adminRoutes } from './routes/adminRoutes.js'

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    }),
  )
  app.use(express.json())
  app.use(cookieParser())
  app.use(requestLogger)

  app.use('/api', publicRoutes)
  app.use('/api/auth', authRoutes)
  app.use('/api/admin', adminRoutes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
