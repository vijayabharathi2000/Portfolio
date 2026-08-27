import { Schema, model, type InferSchemaType } from 'mongoose'

const profileSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    headline: { type: String, default: '' },
    introduction: { type: String, default: '' },
    summary: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    profileImageUrl: { type: String, default: '' },
  },
  { timestamps: true },
)

export type Profile = InferSchemaType<typeof profileSchema>
export const ProfileModel = model('Profile', profileSchema)
