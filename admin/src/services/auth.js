/**
 * Mock authentication. Swap the login body for POST /api/auth/login and keep
 * the same shape: { user, token } in, session object out.
 */

import { storage } from './storage'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

export const DEMO_CREDENTIALS = {
  email: 'admin@radium.example',
  password: 'radium@2026',
}

const USER = {
  name: 'Radium Admin',
  email: DEMO_CREDENTIALS.email,
  role: 'Administrator',
  initials: 'RA',
}

export const auth = {
  async login(email, password) {
    await wait(650)
    if (
      email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password
    ) {
      const session = { user: USER, token: 'mock-token', signedInAt: new Date().toISOString() }
      storage.set('session', session)
      return session
    }
    throw new Error('Invalid email or password.')
  },

  logout() {
    storage.remove('session')
  },

  session() {
    return storage.get('session', null)
  },
}
