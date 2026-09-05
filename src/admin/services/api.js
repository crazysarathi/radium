/**
 * REST data layer — talks to the FastAPI backend. Every collection exposes
 * the same async list/get/create/update/remove shape the UI already
 * consumes; the server now owns activity logging on every mutation, so
 * there's nothing to do here beyond the request itself.
 */

import { apiClient } from './apiClient'

function createCollection(resourcePath) {
  return {
    // React Query cache key — one entry per collection.
    key: resourcePath,

    async list() {
      return apiClient.get(resourcePath)
    },

    async get(id) {
      try {
        return await apiClient.get(`${resourcePath}/${id}`)
      } catch (e) {
        if (e.status === 404) return null
        throw e
      }
    },

    async create(data) {
      return apiClient.post(resourcePath, data)
    },

    async update(id, patch) {
      return apiClient.patch(`${resourcePath}/${id}`, patch)
    },

    async remove(id) {
      await apiClient.delete(`${resourcePath}/${id}`)
      return true
    },
  }
}

export const productsApi = createCollection('/products')
export const variantsApi = createCollection('/variants')
export const accessoriesApi = createCollection('/accessories')

// Enquiries are visitor-submitted, not admin-authored — the console can only
// triage (update status) and delete them, never create one.
export const enquiriesApi = {
  key: '/enquiries',
  async list() {
    return apiClient.get('/enquiries')
  },
  async update(id, patch) {
    return apiClient.patch(`/enquiries/${id}`, patch)
  },
  async remove(id) {
    await apiClient.delete(`/enquiries/${id}`)
    return true
  },
}

// User accounts — admin-only endpoints (the backend enforces this too).
// Unlike the catalogue routes this list is paginated server-side (page_size
// capped at 100), so walk every page until one comes back short and keep the
// client-side list-controls pattern working on the full set.
export const usersApi = {
  key: '/users',
  async list() {
    const pageSize = 100
    const all = []
    for (let page = 1; ; page += 1) {
      const rows = await apiClient.get(`/users?page=${page}&page_size=${pageSize}`)
      all.push(...rows)
      if (rows.length < pageSize) return all
    }
  },
  async get(id) {
    try {
      return await apiClient.get(`/users/${id}`)
    } catch (e) {
      if (e.status === 404) return null
      throw e
    }
  },
  async create(data) {
    return apiClient.post('/users', data)
  },
  async update(id, patch) {
    return apiClient.patch(`/users/${id}`, patch)
  },
  async remove(id) {
    await apiClient.delete(`/users/${id}`)
    return true
  },
}

export const categoriesApi = createCollection('/categories')

export const activityApi = {
  key: '/activity',
  async list() {
    return apiClient.get('/activity')
  },
}
