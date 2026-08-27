import { z } from 'zod'
import { optionalUrl } from './common.js'

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  headline: z.string().trim().optional().default(''),
  introduction: z.string().trim().optional().default(''),
  summary: z.string().trim().optional().default(''),
  email: z.string().trim().email('Must be a valid email address').optional().or(z.literal('')),
  phone: z.string().trim().optional().default(''),
  location: z.string().trim().optional().default(''),
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  resumeUrl: optionalUrl,
  profileImageUrl: optionalUrl,
})

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
