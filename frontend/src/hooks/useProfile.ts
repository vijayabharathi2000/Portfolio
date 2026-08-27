import { useContext } from 'react'
import { ProfileContext } from '../lib/profile-context'

export function useProfile() {
  const state = useContext(ProfileContext)
  if (!state) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return state
}
