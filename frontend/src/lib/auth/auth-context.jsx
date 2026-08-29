import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { authApi } from '@/lib/api/auth-client'
import { clearToken, getToken, setToken } from '@/lib/auth/token-storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore the session from the stored token on reload.
  useEffect(() => {
    if (!getToken()) {
      setLoading(false)
      return
    }
    authApi
      .me()
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const { access_token: accessToken } = await authApi.login(email, password)
    setToken(accessToken)
    setUser(await authApi.me())
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth phải nằm trong AuthProvider')
  return context
}
