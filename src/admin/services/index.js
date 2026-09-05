/**
 * Service registry — one instance per editable resource, backed by the real
 * API. UI components only ever import from here (or auth.js).
 */

import {
  productsApi,
  categoriesApi,
  variantsApi,
  accessoriesApi,
  enquiriesApi,
  activityApi,
  usersApi,
} from './api'

export const api = {
  products: productsApi,
  categories: categoriesApi,
  variants: variantsApi,
  accessories: accessoriesApi,
  enquiries: enquiriesApi,
  activity: activityApi,
  users: usersApi,
}
