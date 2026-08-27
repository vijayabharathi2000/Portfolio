import { z } from 'zod'
import { Types } from 'mongoose'

export const objectIdParamSchema = z.object({
  id: z.string().refine((value) => Types.ObjectId.isValid(value), {
    message: 'Invalid id format',
  }),
})

export const slugParamSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
})

export const optionalUrl = z
  .string()
  .trim()
  .url('Must be a valid URL')
  .optional()
  .or(z.literal(''))

export const slugField = z
  .string()
  .trim()
  .min(1, 'Slug is required')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase, alphanumeric, and hyphen-separated')
