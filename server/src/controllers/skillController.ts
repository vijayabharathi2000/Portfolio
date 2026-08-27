import type { Request, Response } from 'express'
import { skillService } from '../services/skillService.js'
import { sendSuccess } from '../utils/apiResponse.js'
import type { SkillInput, SkillUpdateInput } from '../validators/skillValidators.js'

export const skillController = {
  async listVisible(_req: Request, res: Response) {
    const skills = await skillService.listVisible()
    return sendSuccess(res, skills)
  },

  async listAll(_req: Request, res: Response) {
    const skills = await skillService.listAll()
    return sendSuccess(res, skills)
  },

  async create(req: Request<unknown, unknown, SkillInput>, res: Response) {
    const skill = await skillService.create(req.body)
    return sendSuccess(res, skill, 201)
  },

  async update(req: Request<{ id: string }, unknown, SkillUpdateInput>, res: Response) {
    const skill = await skillService.update(req.params.id, req.body)
    return sendSuccess(res, skill)
  },

  async remove(req: Request<{ id: string }>, res: Response) {
    await skillService.remove(req.params.id)
    return sendSuccess(res, { deleted: true })
  },
}
