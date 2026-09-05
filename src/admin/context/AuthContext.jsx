import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { auth } from '@/admin/services/auth'
import { SESSION_EXPIRED_EVENT } from '@/admin/services/apiClient'

const AuthContext = createContext(null)

// `roleKey` is the raw backend role; sessions stored before it existed only
// carry the display string, so fall back to that until the next sign-in.
const isAdminUser = (user) =>
  user?.roleKey === 'admin' || (!user?.roleKey && user?.role === 'Administrator')

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => auth.session())

  // Fired by apiClient when a refresh attempt fails outright (e.g. the
  // refresh token itself expired) — drop back to signed-out state.
  useEffect(() => {
    const onExpired = () => setSession(null)
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired)
  }, [])

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
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        isAdmin: isAdminUser(session?.user),
        login,
        logout,
      }}
    >
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

/** Gate for admin-only routes (user management) — editors/viewers bounce home. */
export function RequireAdmin({ children }) {
  const { isAdmin } = useAuth()
  if (!isAdmin) return <Navigate to="/products" replace />
  return children
}
