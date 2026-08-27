import { Schema, model, type InferSchemaType } from 'mongoose'

const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, default: '' },
    description: { type: String, required: true },
    technologies: { type: [String], default: [] },
    githubUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
    problem: { type: String, default: '' },
    solution: { type: String, default: '' },
    architecture: { type: String, default: '' },
    keyFeatures: { type: [String], default: [] },
    challenges: { type: String, default: '' },
    technicalDecisions: { type: String, default: '' },
    whatILearned: { type: String, default: '' },
  },
  { timestamps: true },
)

export type Project = InferSchemaType<typeof projectSchema>
export const ProjectModel = model('Project', projectSchema)
