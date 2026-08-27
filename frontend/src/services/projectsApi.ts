import { api } from './api'
import type { Project, ProjectInput } from '../types/cms'

export const projectsApi = {
  list: () => api.get<Project[]>('/projects'),
  getBySlug: (slug: string) => api.get<Project>(`/projects/${slug}`),

  adminList: () => api.get<Project[]>('/admin/projects'),
  create: (input: ProjectInput) => api.post<Project>('/admin/projects', input),
  update: (id: string, input: Partial<ProjectInput>) =>
    api.put<Project>(`/admin/projects/${id}`, input),
  remove: (id: string) => api.delete<{ deleted: true }>(`/admin/projects/${id}`),
}
