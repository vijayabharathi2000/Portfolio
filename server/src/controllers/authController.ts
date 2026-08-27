import type { CookieOptions, Request, Response } from 'express'
import { env } from '../config/env.js'
import { AUTH_COOKIE_NAME } from '../middleware/auth.js'
import { authService } from '../services/authService.js'
import { sendSuccess } from '../utils/apiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import type { LoginInput } from '../validators/authValidators.js'

function cookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
  }
}

export const authController = {
  async login(req: Request<unknown, unknown, LoginInput>, res: Response) {
    const { token, user } = await authService.login(req.body)
    res.cookie(AUTH_COOKIE_NAME, token, cookieOptions())
    return sendSuccess(res, { user })
  },

  logout(_req: Request, res: Response) {
    res.clearCookie(AUTH_COOKIE_NAME, { ...cookieOptions(), maxAge: undefined })
    return sendSuccess(res, { loggedOut: true })
  },

  async me(req: Request, res: Response) {
    if (!req.admin) {
      throw ApiError.unauthorized()
    }
    const user = await authService.getById(req.admin.sub)
    return sendSuccess(res, { user })
  },
}
