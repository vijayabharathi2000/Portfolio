import type { Request, Response } from 'express'
import { experienceService } from '../services/experienceService.js'
import { sendSuccess } from '../utils/apiResponse.js'
import type {
  ExperienceInput,
  ExperienceUpdateInput,
} from '../validators/experienceValidators.js'

export const experienceController = {
  async listVisible(_req: Request, res: Response) {
    const experience = await experienceService.listVisible()
    return sendSuccess(res, experience)
  },

  async listAll(_req: Request, res: Response) {
    const experience = await experienceService.listAll()
    return sendSuccess(res, experience)
  },

  async create(req: Request<unknown, unknown, ExperienceInput>, res: Response) {
    const experience = await experienceService.create(req.body)
    return sendSuccess(res, experience, 201)
  },

  async update(
    req: Request<{ id: string }, unknown, ExperienceUpdateInput>,
    res: Response,
  ) {
    const experience = await experienceService.update(req.params.id, req.body)
    return sendSuccess(res, experience)
  },

  async remove(req: Request<{ id: string }>, res: Response) {
    await experienceService.remove(req.params.id)
    return sendSuccess(res, { deleted: true })
  },
}
