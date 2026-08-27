import { Schema, model, type InferSchemaType } from 'mongoose'

const skillSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    icon: { type: String, default: '' },
    proficiency: { type: Number, min: 0, max: 100 },
    displayOrder: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export type Skill = InferSchemaType<typeof skillSchema>
export const SkillModel = model('Skill', skillSchema)
