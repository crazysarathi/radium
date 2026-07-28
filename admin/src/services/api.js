/**
 * Mock data layer — THE swap point for the future backend.
 *
 * Every factory returns an object of async functions with REST-shaped
 * signatures. To go live, reimplement these bodies with fetch() against the
 * real API and change nothing else in the app:
 *
 *   list()        →  GET    /api/<key>
 *   get(id)       →  GET    /api/<key>/:id
 *   create(data)  →  POST   /api/<key>
 *   update(id, p) →  PATCH  /api/<key>/:id
 *   remove(id)    →  DELETE /api/<key>/:id
 *
 * For now the store is localStorage, seeded from src/data/*.json on first
 * read. A small artificial latency keeps the UI honest about loading states.
 */

import { storage } from './storage'
import { uid } from '@/utils'

const LATENCY = 320
const wait = (ms = LATENCY) => new Promise((r) => setTimeout(r, ms))
const clone = (v) => JSON.parse(JSON.stringify(v))

/* ------------------------------------------------------------------ */
/* Activity log (drives the dashboard feed)                            */
/* ------------------------------------------------------------------ */

const ACTIVITY_KEY = 'activity'
const ACTIVITY_CAP = 40

let activitySeed = []
export const seedActivity = (seed) => {
  activitySeed = seed
}

const readActivity = () => {
  const cur = storage.get(ACTIVITY_KEY)
  if (cur) return cur
  storage.set(ACTIVITY_KEY, activitySeed)
  return clone(activitySeed)
}

export const logActivity = (type, module, label) => {
  const entry = { id: uid('act'), type, module, label, at: new Date().toISOString() }
  storage.set(ACTIVITY_KEY, [entry, ...readActivity()].slice(0, ACTIVITY_CAP))
}

export const activityApi = {
  async list() {
    await wait(180)
    return readActivity()
  },
}

/* ------------------------------------------------------------------ */
/* Collection factory — list/get/create/update/remove                  */
/* ------------------------------------------------------------------ */

export function createCollection(key, seed, { label = key, activity = true, itemName } = {}) {
  const read = () => {
    const cur = storage.get(key)
    if (cur) return cur
    storage.set(key, seed)
    return clone(seed)
  }
  const write = (items) => storage.set(key, items)
  const nameOf = (item) => item[itemName ?? 'name'] ?? item.title ?? item.id

  return {
    key,
    label,

    async list() {
      await wait()
      return read()
    },

    async get(id) {
      await wait(160)
      return read().find((x) => x.id === id) ?? null
    },

    async create(data) {
      await wait()
      const items = read()
      const item = { id: data.id || uid(key.slice(0, 3)), ...data }
      if (items.some((x) => x.id === item.id)) {
        throw new Error(`An entry with id “${item.id}” already exists.`)
      }
      write([item, ...items])
      if (activity) logActivity('create', label, `Added ${nameOf(item)}`)
      return item
    },

    async update(id, patch) {
      await wait()
      const items = read()
      const idx = items.findIndex((x) => x.id === id)
      if (idx === -1) throw new Error('Entry not found — it may have been deleted.')
      const item = { ...items[idx], ...patch, id }
      items[idx] = item
      write(items)
      if (activity) logActivity('update', label, `Updated ${nameOf(item)}`)
      return item
    },

    async remove(id) {
      await wait()
      const items = read()
      const victim = items.find((x) => x.id === id)
      write(items.filter((x) => x.id !== id))
      if (activity && victim) logActivity('delete', label, `Deleted ${nameOf(victim)}`)
      return true
    },

    async reset() {
      storage.set(key, seed)
    },
  }
}

/* ------------------------------------------------------------------ */
/* Document factory — single-record pages (company, footer, …)         */
/* ------------------------------------------------------------------ */

export function createDocument(key, seed, { label = key } = {}) {
  return {
    key,
    label,

    async get() {
      await wait()
      const cur = storage.get(key)
      if (cur) return cur
      storage.set(key, seed)
      return clone(seed)
    },

    async update(patch) {
      await wait()
      const cur = storage.get(key) ?? clone(seed)
      const next = { ...cur, ...patch }
      storage.set(key, next)
      logActivity('update', label, `Updated ${label}`)
      return next
    },

    async reset() {
      storage.set(key, seed)
    },
  }
}
