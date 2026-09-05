/**
 * Authentication — signs in against the real /auth/login endpoint. Session
 * shape: { accessToken, refreshToken, user: {id, name, email, role, roleKey, initials}, signedInAt }.
 * `role` is the display string ("Administrator"); `roleKey` is the raw
 * backend value ("admin" | "editor" | "viewer") used for permission checks.
 */

import { storage } from './storage'
import { request } from './apiClient'

// Matches the seeded superuser (`python -m app.db.seed` in radium-backend).
export const DEMO_CREDENTIALS = {
  email: 'admin@radium.example',
  password: 'radium@2026',
}

const toDisplayUser = (u) => ({
  id: u.id,
  name: u.full_name,
  email: u.email,
  role: u.role_display,
  roleKey: u.role,
  initials: u.initials,
})

export const auth = {
  async login(email, password) {
    const data = await request('POST', '/auth/login', { email, password })
    const session = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      user: toDisplayUser(data.user),
      signedInAt: data.signed_in_at,
    }
    storage.set('session', session)
    return session
  },

  logout() {
    const session = storage.get('session')
    storage.remove('session')
    if (session?.refreshToken) {
      // Best-effort revoke — the console signs out locally either way.
      request('POST', '/auth/logout', { refresh_token: session.refreshToken }).catch(() => {})
    }
  },

  session() {
    return storage.get('session', null)
  },
}
