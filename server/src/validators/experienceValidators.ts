import { z } from 'zod'

// See projectValidators.ts for why create/update don't share one .partial() schema.
const experienceFields = {
  company: z.string().trim().min(1, 'Company is required'),
  role: z.string().trim().min(1, 'Role is required'),
  location: z.string().trim().optional(),
  startDate: z.string().trim().min(1, 'Start date is required'),
  endDate: z.string().trim().optional(),
  current: z.boolean().optional(),
  description: z.string().trim().optional(),
  responsibilities: z.array(z.string().trim().min(1)).optional(),
  technologies: z.array(z.string().trim().min(1)).optional(),
  displayOrder: z.number().int().optional(),
  visible: z.boolean().optional(),
}

export const experienceInputSchema = z.object(experienceFields).extend({
  location: experienceFields.location.default(''),
  endDate: experienceFields.endDate.default(''),
  current: experienceFields.current.default(false),
  description: experienceFields.description.default(''),
  responsibilities: experienceFields.responsibilities.default([]),
  technologies: experienceFields.technologies.default([]),
  displayOrder: experienceFields.displayOrder.default(0),
  visible: experienceFields.visible.default(true),
})

export const experienceUpdateSchema = z.object(experienceFields).partial()

export type ExperienceInput = z.infer<typeof experienceInputSchema>
export type ExperienceUpdateInput = z.infer<typeof experienceUpdateSchema>
