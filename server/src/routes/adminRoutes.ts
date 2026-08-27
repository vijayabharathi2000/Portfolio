import { Router } from 'express'
import { requireAdmin } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { objectIdParamSchema } from '../validators/common.js'

import { projectController } from '../controllers/projectController.js'
import { projectInputSchema, projectUpdateSchema } from '../validators/projectValidators.js'

import { skillController } from '../controllers/skillController.js'
import { skillInputSchema, skillUpdateSchema } from '../validators/skillValidators.js'

import { experienceController } from '../controllers/experienceController.js'
import {
  experienceInputSchema,
  experienceUpdateSchema,
} from '../validators/experienceValidators.js'

import { certificationController } from '../controllers/certificationController.js'
import {
  certificationInputSchema,
  certificationUpdateSchema,
} from '../validators/certificationValidators.js'

import { profileController } from '../controllers/profileController.js'
import { profileUpdateSchema } from '../validators/profileValidators.js'

export const adminRoutes = Router()

// Every route below requires a valid admin session, verified server-side
// regardless of what the frontend allows.
adminRoutes.use(requireAdmin)

adminRoutes.get('/projects', projectController.listAll)
adminRoutes.post('/projects', validate(projectInputSchema), projectController.create)
adminRoutes.put(
  '/projects/:id',
  validate(objectIdParamSchema, 'params'),
  validate(projectUpdateSchema),
  projectController.update,
)
adminRoutes.delete(
  '/projects/:id',
  validate(objectIdParamSchema, 'params'),
  projectController.remove,
)

adminRoutes.get('/skills', skillController.listAll)
adminRoutes.post('/skills', validate(skillInputSchema), skillController.create)
adminRoutes.put(
  '/skills/:id',
  validate(objectIdParamSchema, 'params'),
  validate(skillUpdateSchema),
  skillController.update,
)
adminRoutes.delete(
  '/skills/:id',
  validate(objectIdParamSchema, 'params'),
  skillController.remove,
)

adminRoutes.get('/experience', experienceController.listAll)
adminRoutes.post(
  '/experience',
  validate(experienceInputSchema),
  experienceController.create,
)
adminRoutes.put(
  '/experience/:id',
  validate(objectIdParamSchema, 'params'),
  validate(experienceUpdateSchema),
  experienceController.update,
)
adminRoutes.delete(
  '/experience/:id',
  validate(objectIdParamSchema, 'params'),
  experienceController.remove,
)

adminRoutes.get('/certifications', certificationController.listAll)
adminRoutes.post(
  '/certifications',
  validate(certificationInputSchema),
  certificationController.create,
)
adminRoutes.put(
  '/certifications/:id',
  validate(objectIdParamSchema, 'params'),
  validate(certificationUpdateSchema),
  certificationController.update,
)
adminRoutes.delete(
  '/certifications/:id',
  validate(objectIdParamSchema, 'params'),
  certificationController.remove,
)

adminRoutes.get('/profile', profileController.get)
adminRoutes.put('/profile', validate(profileUpdateSchema), profileController.update)
