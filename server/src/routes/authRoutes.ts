import { Router } from 'express'
import { authController } from '../controllers/authController.js'
import { requireAdmin } from '../middleware/auth.js'
import { loginRateLimit } from '../middleware/loginRateLimit.js'
import { validate } from '../middleware/validate.js'
import { loginSchema } from '../validators/authValidators.js'

export const authRoutes = Router()

authRoutes.post('/login', loginRateLimit, validate(loginSchema), authController.login)
authRoutes.post('/logout', authController.logout)
authRoutes.get('/me', requireAdmin, authController.me)
