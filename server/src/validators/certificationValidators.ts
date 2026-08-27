import { z } from 'zod'
import { optionalUrl } from './common.js'

// See projectValidators.ts for why create/update don't share one .partial() schema.
const certificationFields = {
  name: z.string().trim().min(1, 'Name is required'),
  issuer: z.string().trim().min(1, 'Issuer is required'),
  issueDate: z.string().trim().optional(),
  credentialId: z.string().trim().optional(),
  credentialUrl: optionalUrl,
  description: z.string().trim().optional(),
  displayOrder: z.number().int().optional(),
  visible: z.boolean().optional(),
}

export const certificationInputSchema = z.object(certificationFields).extend({
  issueDate: certificationFields.issueDate.default(''),
  credentialId: certificationFields.credentialId.default(''),
  description: certificationFields.description.default(''),
  displayOrder: certificationFields.displayOrder.default(0),
  visible: certificationFields.visible.default(true),
})

export const certificationUpdateSchema = z.object(certificationFields).partial()

export type CertificationInput = z.infer<typeof certificationInputSchema>
export type CertificationUpdateInput = z.infer<typeof certificationUpdateSchema>
