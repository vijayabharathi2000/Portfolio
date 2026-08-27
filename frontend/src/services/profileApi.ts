import { api } from './api'
import type { Profile } from '../types/cms'

export const profileApi = {
  get: () => api.get<Profile>('/profile'),

  adminGet: () => api.get<Profile>('/admin/profile'),
  update: (input: Profile) => api.put<Profile>('/admin/profile', input),
}
