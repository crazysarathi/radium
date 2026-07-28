/**
 * localStorage adapter — the ONLY place the admin touches the browser store.
 * Everything is namespaced under `radium.admin.` so clearing the demo never
 * touches anything else on the origin.
 */

const NS = 'radium.admin.'

export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(NS + key)
      return raw == null ? fallback : JSON.parse(raw)
    } catch {
      return fallback
    }
  },
  set(key, value) {
    localStorage.setItem(NS + key, JSON.stringify(value))
  },
  remove(key) {
    localStorage.removeItem(NS + key)
  },
  /** Remove every namespaced key — full demo reset. */
  clearAll() {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(NS))
      .forEach((k) => localStorage.removeItem(k))
  },
}
