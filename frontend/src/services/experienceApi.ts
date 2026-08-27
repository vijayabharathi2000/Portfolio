import { api } from './api'
import type { Experience, ExperienceInput } from '../types/cms'

export const experienceApi = {
  list: () => api.get<Experience[]>('/experience'),

  adminList: () => api.get<Experience[]>('/admin/experience'),
  create: (input: ExperienceInput) => api.post<Experience>('/admin/experience', input),
  update: (id: string, input: Partial<ExperienceInput>) =>
    api.put<Experience>(`/admin/experience/${id}`, input),
  remove: (id: string) => api.delete<{ deleted: true }>(`/admin/experience/${id}`),
}
