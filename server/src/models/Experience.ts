import { Schema, model, type InferSchemaType } from 'mongoose'

const experienceSchema = new Schema(
  {
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    location: { type: String, default: '' },
    startDate: { type: String, required: true },
    endDate: { type: String, default: '' },
    current: { type: Boolean, default: false },
    description: { type: String, default: '' },
    responsibilities: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    displayOrder: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export type Experience = InferSchemaType<typeof experienceSchema>
export const ExperienceModel = model('Experience', experienceSchema)
