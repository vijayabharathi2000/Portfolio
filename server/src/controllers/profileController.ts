import type { Request, Response } from 'express'
import { profileService } from '../services/profileService.js'
import { sendSuccess } from '../utils/apiResponse.js'
import type { ProfileUpdateInput } from '../validators/profileValidators.js'

export const profileController = {
  async get(_req: Request, res: Response) {
    const profile = await profileService.get()
    return sendSuccess(res, profile)
  },

  async update(req: Request<unknown, unknown, ProfileUpdateInput>, res: Response) {
    const profile = await profileService.update(req.body)
    return sendSuccess(res, profile)
  },
}
