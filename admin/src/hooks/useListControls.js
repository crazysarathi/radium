import { useEffect, useMemo, useState } from 'react'

const valueAt = (obj, path) =>
  path.split('.').reduce((v, k) => (v == null ? v : v[k]), obj)

/**
 * Client-side search + filters + pagination over an in-memory list.
 * Filters are `{ key: value }`; a value of 'all' (or undefined) is a no-op.
 */
export function useListControls(items, { searchKeys = [], pageSize = 8 } = {}) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({})
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let out = items ?? []
    const q = query.trim().toLowerCase()
    if (q) {
      out = out.filter((item) =>
        searchKeys.some((k) => {
          const v = valueAt(item, k)
          return v != null && String(v).toLowerCase().includes(q)
        })
      )
    }
    for (const [key, value] of Object.entries(filters)) {
      if (value && value !== 'all') out = out.filter((item) => String(valueAt(item, key)) === String(value))
    }
    return out
  }, [items, query, filters, searchKeys])

  useEffect(() => {
    setPage(1)
  }, [query, filters])

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, pages)
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const setFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }))

  return {
    query,
    setQuery,
    filters,
    setFilter,
    page: safePage,
    setPage,
    pages,
    total: filtered.length,
    pageItems,
  }
}
