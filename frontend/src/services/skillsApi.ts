import { api } from './api'
import type { Skill, SkillInput } from '../types/cms'

export const skillsApi = {
  list: () => api.get<Skill[]>('/skills'),

  adminList: () => api.get<Skill[]>('/admin/skills'),
  create: (input: SkillInput) => api.post<Skill>('/admin/skills', input),
  update: (id: string, input: Partial<SkillInput>) =>
    api.put<Skill>(`/admin/skills/${id}`, input),
  remove: (id: string) => api.delete<{ deleted: true }>(`/admin/skills/${id}`),
}
