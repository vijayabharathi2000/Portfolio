import type { Request, Response } from 'express'
import { projectService } from '../services/projectService.js'
import { sendSuccess } from '../utils/apiResponse.js'
import type { ProjectInput, ProjectUpdateInput } from '../validators/projectValidators.js'

export const projectController = {
  async listPublished(_req: Request, res: Response) {
    const projects = await projectService.listPublished()
    return sendSuccess(res, projects)
  },

  async getPublishedBySlug(req: Request<{ slug: string }>, res: Response) {
    const project = await projectService.getPublishedBySlug(req.params.slug)
    return sendSuccess(res, project)
  },

  async listAll(_req: Request, res: Response) {
    const projects = await projectService.listAll()
    return sendSuccess(res, projects)
  },

  async create(req: Request<unknown, unknown, ProjectInput>, res: Response) {
    const project = await projectService.create(req.body)
    return sendSuccess(res, project, 201)
  },

  async update(req: Request<{ id: string }, unknown, ProjectUpdateInput>, res: Response) {
    const project = await projectService.update(req.params.id, req.body)
    return sendSuccess(res, project)
  },

  async remove(req: Request<{ id: string }>, res: Response) {
    await projectService.remove(req.params.id)
    return sendSuccess(res, { deleted: true })
  },
}
