import { ProjectModel } from '../models/Project.js'
import { ApiError } from '../utils/ApiError.js'
import type { ProjectInput, ProjectUpdateInput } from '../validators/projectValidators.js'

async function assertSlugAvailable(slug: string, excludeId?: string) {
  const existing = await ProjectModel.findOne({ slug }).lean()
  if (existing && existing._id.toString() !== excludeId) {
    throw ApiError.badRequest('Validation failed', [
      { field: 'slug', message: 'Slug is already in use' },
    ])
  }
}

export const projectService = {
  listPublished() {
    return ProjectModel.find({ published: true }).sort({ displayOrder: 1 }).lean()
  },

  listAll() {
    return ProjectModel.find().sort({ displayOrder: 1 }).lean()
  },

  async getPublishedBySlug(slug: string) {
    const project = await ProjectModel.findOne({ slug, published: true }).lean()
    if (!project) {
      throw ApiError.notFound('Project not found')
    }
    return project
  },

  async create(input: ProjectInput) {
    await assertSlugAvailable(input.slug)
    return ProjectModel.create(input)
  },

  async update(id: string, input: ProjectUpdateInput) {
    if (input.slug) {
      await assertSlugAvailable(input.slug, id)
    }
    const project = await ProjectModel.findByIdAndUpdate(id, input, { returnDocument: 'after' })
    if (!project) {
      throw ApiError.notFound('Project not found')
    }
    return project
  },

  async remove(id: string) {
    const project = await ProjectModel.findByIdAndDelete(id)
    if (!project) {
      throw ApiError.notFound('Project not found')
    }
  },
}
