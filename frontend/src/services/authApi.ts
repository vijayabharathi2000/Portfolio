import { api } from './api'
import type { AdminUser } from '../types/cms'

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ user: AdminUser }>('/auth/login', { email, password }),
  logout: () => api.post<{ loggedOut: true }>('/auth/logout'),
  me: () => api.get<{ user: AdminUser }>('/auth/me'),
}
