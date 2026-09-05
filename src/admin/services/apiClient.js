/**
 * Fetch wrapper — the transport underneath services/api.js and
 * services/auth.js. Attaches the bearer token, retries once through a token
 * refresh on 401, and unwraps the backend's envelope —
 * `{success, message, data, meta}` on success, `{success:false, message,
 * errors}` on failure — into either a return value or a thrown Error (so
 * existing `catch (e) { toast.error(..., e.message) }` call sites keep
 * working unchanged).
 */

import { storage } from './storage'

export const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1'
export const SESSION_EXPIRED_EVENT = 'radium-admin:session-expired'

// Concurrent 401s share one in-flight refresh instead of racing each other.
let refreshing = null

const authHeader = () => {
  const session = storage.get('session')
  return session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}
}

async function parseEnvelope(response) {
  let body = null
  try {
    body = await response.json()
  } catch {
    // No/invalid JSON body — fall through to the status-based message below.
  }
  if (response.ok && body?.success !== false) return body ?? {}

  const detail = body?.errors?.length
    ? body.errors.map((e) => (e.field ? `${e.field}: ${e.message}` : e.message)).join('; ')
    : null
  const message = detail
    ? `${body?.message ?? 'Request failed'} — ${detail}`
    : (body?.message ?? `Request failed (${response.status})`)
  const error = new Error(message)
  error.status = response.status
  throw error
}

async function refreshSession() {
  const session = storage.get('session')
  if (!session?.refreshToken) throw new Error('No refresh token')
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: session.refreshToken }),
  })
  const body = await parseEnvelope(res)
  const next = { ...session, accessToken: body.data.access_token, refreshToken: body.data.refresh_token }
  storage.set('session', next)
  return next
}

const rawRequest = (method, path, body, extraHeaders = {}) =>
  fetch(`${BASE_URL}${path}`, {
    method,
    headers: { ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...authHeader(), ...extraHeaders },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

/** Runs `exec`; on a 401 (outside auth itself) refreshes the token once and retries. */
async function withAuthRetry(path, exec) {
  let res = await exec()
  if (res.status === 401 && path !== '/auth/login' && path !== '/auth/refresh') {
    try {
      refreshing = refreshing ?? refreshSession().finally(() => (refreshing = null))
      await refreshing
      res = await exec()
    } catch {
      storage.remove('session')
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
      throw new Error('Your session has expired — please sign in again.')
    }
  }
  return res
}

export async function request(method, path, body) {
  const res = await withAuthRetry(path, () => rawRequest(method, path, body))
  const envelope = await parseEnvelope(res)
  return envelope.data
}

export const apiClient = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  patch: (path, body) => request('PATCH', path, body),
  delete: (path) => request('DELETE', path),
}

/** Multipart upload — POST /media, returns the hosted file's `{url, path, ...}`. */
export async function uploadFile(file, folder = '') {
  const form = new FormData()
  form.append('file', file)
  const qs = folder ? `?folder=${encodeURIComponent(folder)}` : ''
  const path = `/media${qs}`
  const res = await withAuthRetry(path, () =>
    fetch(`${BASE_URL}${path}`, { method: 'POST', headers: { ...authHeader() }, body: form })
  )
  const envelope = await parseEnvelope(res)
  return envelope.data
}
