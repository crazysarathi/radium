/**
 * Public catalogue data layer — talks to the four read-only GET endpoints
 * the marketing site needs. List-only (the public site never mutates the
 * catalogue); admin authoring happens in the separate admin console.
 */

import { apiClient } from './apiClient'

const list = (path) => () => apiClient.get(path)

export const catalogueApi = {
  products: list('/products'),
  categories: list('/categories'),
  variants: list('/variants'),
  accessories: list('/accessories'),
}
