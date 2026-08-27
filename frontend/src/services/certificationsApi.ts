import { api } from './api'
import type { Certification, CertificationInput } from '../types/cms'

export const certificationsApi = {
  list: () => api.get<Certification[]>('/certifications'),

  adminList: () => api.get<Certification[]>('/admin/certifications'),
  create: (input: CertificationInput) =>
    api.post<Certification>('/admin/certifications', input),
  update: (id: string, input: Partial<CertificationInput>) =>
    api.put<Certification>(`/admin/certifications/${id}`, input),
  remove: (id: string) => api.delete<{ deleted: true }>(`/admin/certifications/${id}`),
}
