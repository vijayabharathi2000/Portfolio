import { z } from 'zod'
import { optionalUrl, slugField } from './common.js'

// Base field shapes with no defaults, shared by create and update so a
// partial update never re-injects a default for a field the client omitted
// (z.object(...).partial() alone does not suppress .default()).
const projectFields = {
  title: z.string().trim().min(1, 'Title is required'),
  slug: slugField,
  shortDescription: z.string().trim().optional(),
  description: z.string().trim().min(1, 'Description is required'),
  technologies: z.array(z.string().trim().min(1)).optional(),
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  imageUrl: optionalUrl,
  featured: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  published: z.boolean().optional(),
  problem: z.string().trim().optional(),
  solution: z.string().trim().optional(),
  architecture: z.string().trim().optional(),
  keyFeatures: z.array(z.string().trim().min(1)).optional(),
  challenges: z.string().trim().optional(),
  technicalDecisions: z.string().trim().optional(),
  whatILearned: z.string().trim().optional(),
}

export const projectInputSchema = z.object(projectFields).extend({
  shortDescription: projectFields.shortDescription.default(''),
  technologies: projectFields.technologies.default([]),
  featured: projectFields.featured.default(false),
  displayOrder: projectFields.displayOrder.default(0),
  published: projectFields.published.default(false),
  problem: projectFields.problem.default(''),
  solution: projectFields.solution.default(''),
  architecture: projectFields.architecture.default(''),
  keyFeatures: projectFields.keyFeatures.default([]),
  challenges: projectFields.challenges.default(''),
  technicalDecisions: projectFields.technicalDecisions.default(''),
  whatILearned: projectFields.whatILearned.default(''),
})

export const projectUpdateSchema = z.object(projectFields).partial()

export type ProjectInput = z.infer<typeof projectInputSchema>
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>
