import { createContext } from 'react'
import type { ApiResourceState } from '../hooks/useApiResource'
import type { Profile } from '../types/cms'

export const ProfileContext = createContext<ApiResourceState<Profile> | null>(null)
