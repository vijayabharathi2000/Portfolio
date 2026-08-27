import type { NextFunction, Request, Response } from 'express'
import { ApiError } from '../utils/ApiError.js'
import { verifyAdminToken, type AdminTokenPayload } from '../utils/jwt.js'

export const AUTH_COOKIE_NAME = 'portfolio_admin_token'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: AdminTokenPayload
    }
  }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[AUTH_COOKIE_NAME]

  if (!token) {
    return next(ApiError.unauthorized())
  }

  try {
    req.admin = verifyAdminToken(token)
    next()
  } catch {
    return next(ApiError.unauthorized())
  }
}
