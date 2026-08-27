import { z } from 'zod'

// See projectValidators.ts for why create/update don't share one .partial() schema.
const skillFields = {
  name: z.string().trim().min(1, 'Name is required'),
  category: z.string().trim().min(1, 'Category is required'),
  icon: z.string().trim().optional(),
  proficiency: z.number().min(0).max(100).optional(),
  displayOrder: z.number().int().optional(),
  visible: z.boolean().optional(),
}

export const skillInputSchema = z.object(skillFields).extend({
  icon: skillFields.icon.default(''),
  displayOrder: skillFields.displayOrder.default(0),
  visible: skillFields.visible.default(true),
})

export const skillUpdateSchema = z.object(skillFields).partial()

export type SkillInput = z.infer<typeof skillInputSchema>
export type SkillUpdateInput = z.infer<typeof skillUpdateSchema>
