/**
 * Service registry — one instance per editable resource.
 *
 * UI components only ever import from here (or auth.js). When the backend
 * arrives, point the factories in api.js at fetch() and this file — and every
 * screen above it — stays exactly as it is.
 */

import { createCollection, createDocument, activityApi, seedActivity, logActivity } from './api'
import { storage } from './storage'

import productsSeed from '@/data/products.json'
import categoriesSeed from '@/data/categories.json'
import jupiterModelsSeed from '@/data/jupiter-models.json'
import chassisModelsSeed from '@/data/chassis-models.json'
import accessoriesSeed from '@/data/accessories.json'
import solutionsSeed from '@/data/solutions.json'
import resourcesSeed from '@/data/resources.json'
import heroSlidesSeed from '@/data/hero-slides.json'
import enquiriesSeed from '@/data/enquiries.json'
import seoSeed from '@/data/seo.json'
import companySeed from '@/data/company.json'
import contactSeed from '@/data/contact.json'
import navigationSeed from '@/data/navigation.json'
import footerSeed from '@/data/footer.json'
import activitySeed from '@/data/activity.json'

seedActivity(activitySeed)

export const api = {
  // Catalogue
  products: createCollection('products', productsSeed, { label: 'Products' }),
  categories: createCollection('categories', categoriesSeed, { label: 'Categories', itemName: 'label' }),
  jupiterModels: createCollection('jupiter-models', jupiterModelsSeed, { label: 'Jupiter Models' }),
  chassisModels: createCollection('chassis-models', chassisModelsSeed, { label: 'Chassis Models', itemName: 'model' }),
  accessories: createCollection('accessories', accessoriesSeed, { label: 'Accessories' }),

  // Content
  heroSlides: createCollection('hero-slides', heroSlidesSeed, { label: 'Hero Slides', itemName: 'title' }),
  solutions: createCollection('solutions', solutionsSeed, { label: 'Solutions', itemName: 'title' }),
  resources: createCollection('resources', resourcesSeed, { label: 'Resources', itemName: 'title' }),
  company: createDocument('company', companySeed, { label: 'Company page' }),
  contact: createDocument('contact', contactSeed, { label: 'Contact page' }),

  // Site chrome
  navigation: createDocument('navigation', navigationSeed, { label: 'Navigation' }),
  footer: createDocument('footer', footerSeed, { label: 'Footer' }),
  seo: createCollection('seo', seoSeed, { label: 'SEO', itemName: 'path' }),
  media: createCollection('media', [], { label: 'Media', itemName: 'label' }),

  // Inbox — form submissions are visitor data, keep them out of the activity feed
  enquiries: createCollection('enquiries', enquiriesSeed, { label: 'Enquiries', activity: false }),

  activity: activityApi,
}

export { logActivity }

/** Wipe every stored collection so the seeds load fresh on next read. */
export const resetAllData = async () => {
  const session = storage.get('session')
  storage.clearAll()
  if (session) storage.set('session', session)
}
