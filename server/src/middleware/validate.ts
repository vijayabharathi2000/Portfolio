import type { NextFunction, Request, Response } from 'express'
import type { ZodType } from 'zod'
import { ApiError, type FieldError } from '../utils/ApiError.js'

type RequestPart = 'body' | 'params'

export function validate(schema: ZodType, part: RequestPart = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[part])

    if (!result.success) {
      const errors: FieldError[] = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || part,
        message: issue.message,
      }))
      return next(ApiError.badRequest('Validation failed', errors))
    }

    if (part === 'body') {
      req.body = result.data
    } else {
      Object.assign(req.params, result.data)
    }
    next()
  }
}
