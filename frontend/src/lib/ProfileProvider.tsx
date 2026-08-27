import type { ReactNode } from 'react'
import { useApiResource } from '../hooks/useApiResource'
import { profileApi } from '../services/profileApi'
import { ProfileContext } from './profile-context'

export function ProfileProvider({ children }: { children: ReactNode }) {
  const state = useApiResource(profileApi.get, [])

  return (
    <ProfileContext.Provider value={state}>{children}</ProfileContext.Provider>
  )
}
