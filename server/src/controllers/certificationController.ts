import type { Request, Response } from 'express'
import { certificationService } from '../services/certificationService.js'
import { sendSuccess } from '../utils/apiResponse.js'
import type {
  CertificationInput,
  CertificationUpdateInput,
} from '../validators/certificationValidators.js'

export const certificationController = {
  async listVisible(_req: Request, res: Response) {
    const certifications = await certificationService.listVisible()
    return sendSuccess(res, certifications)
  },

  async listAll(_req: Request, res: Response) {
    const certifications = await certificationService.listAll()
    return sendSuccess(res, certifications)
  },

  async create(req: Request<unknown, unknown, CertificationInput>, res: Response) {
    const certification = await certificationService.create(req.body)
    return sendSuccess(res, certification, 201)
  },

  async update(
    req: Request<{ id: string }, unknown, CertificationUpdateInput>,
    res: Response,
  ) {
    const certification = await certificationService.update(req.params.id, req.body)
    return sendSuccess(res, certification)
  },

  async remove(req: Request<{ id: string }>, res: Response) {
    await certificationService.remove(req.params.id)
    return sendSuccess(res, { deleted: true })
  },
}
