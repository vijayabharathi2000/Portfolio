import { Schema, model, type InferSchemaType } from 'mongoose'

const certificationSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    issueDate: { type: String, default: '' },
    credentialId: { type: String, default: '' },
    credentialUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export type Certification = InferSchemaType<typeof certificationSchema>
export const CertificationModel = model('Certification', certificationSchema)
