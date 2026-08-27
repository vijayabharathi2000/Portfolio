import type { Request, Response } from 'express'
import { sendSuccess } from '../utils/apiResponse.js'

export const healthController = {
  check(_req: Request, res: Response) {
    return sendSuccess(res, { status: 'ok' })
  },
}
