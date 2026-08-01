import { createContext, useContext, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { catalogueApi } from '@/services/api'
import { augmentVariant, CATEGORY_ORDER } from '@/lib/catalogue'

/**
 * Catalogue state — fetches the four public catalogue collections once via
 * React Query and exposes them (plus the small cross-collection lookups
 * every page used to import from `src/data/*`) to the whole site. The query
 * cache lives in memory only (no session/local storage): navigation never
 * re-requests, and a full reload fetches fresh. `status` is `loading` on
 * first mount, `ready` once data exists, or `error` if the fetch fails —
 * `<CatalogueGate>` (rendered once, high in the tree) turns that into UI.
 */
const CatalogueContext = createContext(null)

const categoryRank = (key) => {
  const i = CATEGORY_ORDER.indexOf(key)
  return i === -1 ? CATEGORY_ORDER.length : i
}

/** API products come back name-alphabetical — restore the curated line order. */
const sortProducts = (list) =>
  [...list].sort((a, b) => categoryRank(a.category) - categoryRank(b.category) || a.name.localeCompare(b.name))

/** API categories come back id-alphabetical — same curated order as products. */
const sortCategories = (list) => [...list].sort((a, b) => categoryRank(a.key) - categoryRank(b.key))

async function fetchCatalogue() {
  const [products, categories, variants, accessories] = await Promise.all([
    catalogueApi.products(),
    catalogueApi.categories(),
    catalogueApi.variants(),
    catalogueApi.accessories(),
  ])
  return {
    products: sortProducts(products ?? []),
    categories: sortCategories(categories ?? []),
    variants: (variants ?? []).map(augmentVariant),
    accessories: accessories ?? [],
  }
}

export function CatalogueProvider({ children }) {
  const query = useQuery({
    queryKey: ['catalogue'],
    queryFn: fetchCatalogue,
  })

  const data = query.data ?? null
  const status = data ? 'ready' : query.isError ? 'error' : 'loading'
  const error = query.isError ? (query.error?.message ?? 'Failed to load the catalogue.') : null
  const retry = query.refetch

  const value = useMemo(() => {
    return {
      products: data?.products ?? [],
      categories: data?.categories ?? [],
      variants: data?.variants ?? [],
      // Variants that carry a decodable model-number code (storage-server SKUs).
      skuVariants: data?.variants.filter((m) => m.code) ?? [],
      accessories: data?.accessories ?? [],
      status,
      hasData: Boolean(data),
      error,
      retry,
      getProduct: (slug) => data?.products.find((p) => p.slug === slug),
      getProductById: (id) => data?.products.find((p) => p.id === id),
      getVariantByCode: (code) => data?.variants.find((m) => m.code === code),
      categoryLabel: (key) => data?.categories.find((c) => c.key === key)?.label ?? key,
      // Variant.family is a FK to products.id (the immutable identifier), not
      // products.slug — callers must pass a product's `id`, never its
      // (renameable) `slug`.
      variantsFor: (productId) => data?.variants.filter((m) => m.family === productId) ?? [],
      rackUnitsFor: (productId) =>
        [...new Set((data?.variants ?? []).filter((m) => m.family === productId).map((m) => m.rackUnits))].sort(),
      accessoriesFor: (slug) => data?.accessories.filter((a) => a.for.includes(slug)) ?? [],
    }
  }, [data, status, error, retry])

  return <CatalogueContext.Provider value={value}>{children}</CatalogueContext.Provider>
}

export const useCatalogue = () => useContext(CatalogueContext)
