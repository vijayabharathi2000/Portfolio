import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authApi } from '../../services/authApi'
import type { AdminUser } from '../../types/cms'
import { AuthContext, type AuthStatus } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('checking')
  const [user, setUser] = useState<AdminUser | null>(null)

  useEffect(() => {
    let cancelled = false
    authApi
      .me()
      .then(({ user }) => {
        if (cancelled) return
        setUser(user)
        setStatus('authenticated')
      })
      .catch(() => {
        if (cancelled) return
        setUser(null)
        setStatus('unauthenticated')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { user } = await authApi.login(email, password)
    setUser(user)
    setStatus('authenticated')
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
    setUser(null)
    setStatus('unauthenticated')
  }, [])

  const value = useMemo(
    () => ({ status, user, login, logout }),
    [status, user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
