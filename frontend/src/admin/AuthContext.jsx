import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { adminApi, tokenStore } from './adminApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Khôi phục phiên từ token đã lưu khi mở lại trang.
  useEffect(() => {
    if (!tokenStore.get()) {
      setLoading(false)
      return
    }
    adminApi
      .me()
      .then(setUser)
      .catch(() => tokenStore.clear())
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const { access_token } = await adminApi.login(email, password)
    tokenStore.set(access_token)
    setUser(await adminApi.me())
  }, [])

  const logout = useCallback(() => {
    tokenStore.clear()
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
