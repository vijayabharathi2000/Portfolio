import { Router } from 'express'
import { healthController } from '../controllers/healthController.js'
import { profileController } from '../controllers/profileController.js'
import { projectController } from '../controllers/projectController.js'
import { skillController } from '../controllers/skillController.js'
import { experienceController } from '../controllers/experienceController.js'
import { certificationController } from '../controllers/certificationController.js'
import { validate } from '../middleware/validate.js'
import { slugParamSchema } from '../validators/common.js'

export const publicRoutes = Router()

publicRoutes.get('/health', healthController.check)
publicRoutes.get('/profile', profileController.get)
publicRoutes.get('/projects', projectController.listPublished)
publicRoutes.get(
  '/projects/:slug',
  validate(slugParamSchema, 'params'),
  projectController.getPublishedBySlug,
)
publicRoutes.get('/skills', skillController.listVisible)
publicRoutes.get('/experience', experienceController.listVisible)
publicRoutes.get('/certifications', certificationController.listVisible)
