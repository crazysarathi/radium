import { createContext, useCallback, useContext, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { auth } from '@/services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => auth.session())

  const login = useCallback(async (email, password) => {
    const s = await auth.login(email, password)
    setSession(s)
    return s
  }, [])

  const logout = useCallback(() => {
    auth.logout()
    setSession(null)
  }, [])

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

/** Gate for everything under the admin shell. */
export function RequireAuth({ children }) {
  const { session } = useAuth()
  const location = useLocation()
  if (!session) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}
