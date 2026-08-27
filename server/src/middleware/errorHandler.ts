import type { NextFunction, Request, Response } from 'express'
import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'
import { logger } from '../utils/logger.js'

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`))
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors ? { errors: err.errors } : {}),
    })
  }

  logger.error('Unhandled error', err)

  return res.status(500).json({
    success: false,
    message: env.isProduction
      ? 'Something went wrong. Please try again later.'
      : err instanceof Error
        ? err.message
        : 'Unknown error',
  })
}
