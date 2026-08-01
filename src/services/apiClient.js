/**
 * Fetch wrapper for the public Radium catalogue API — read-only, no auth
 * (the public site never signs in). Unwraps the backend's envelope
 * `{success, message, data}` into a plain return value, or throws an
 * `Error` (with `.status` where the server responded) built from the
 * failure envelope — mirrors the admin console's apiClient so error
 * handling reads the same way across both apps.
 */

const API_HOST = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'
export const BASE_URL = `${API_HOST}/api/v1`

// Render's free tier sleeps the backend when idle — the first request after
// a cold start can take tens of seconds, so the timeout stays generous
// rather than failing a request that would have succeeded a few seconds later.
const TIMEOUT_MS = 20000

async function parseEnvelope(response) {
  let body = null
  try {
    body = await response.json()
  } catch {
    // No/invalid JSON body (e.g. a bare 502 during a cold start) — fall
    // through to the status-based message below instead of throwing here.
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

async function get(path) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  let res
  try {
    res = await fetch(`${BASE_URL}${path}`, { method: 'GET', signal: controller.signal })
  } catch (e) {
    if (e.name === 'AbortError') {
      throw new Error('The catalogue service is taking too long to respond. Please try again.')
    }
    throw new Error('Could not reach the catalogue service. Check your connection and try again.')
  } finally {
    clearTimeout(timer)
  }
  const envelope = await parseEnvelope(res)
  return envelope.data
}

export const apiClient = { get }
