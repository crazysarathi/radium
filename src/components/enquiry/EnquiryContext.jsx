import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import accessoriesData from '@/data/accessories.json'

/**
 * Enquiry list — a cart-style tray for products, models and their accessories.
 * Items carry a quantity and persist in localStorage; the EnquiryDrawer renders
 * the tray and hands the list to the contact form as a pre-filled enquiry.
 *
 * Item shape: { id, name, meta, qty } where `id` is namespaced, e.g.
 * `product:jupiter`, `model:242016`, `acc:rail-kit-28`.
 */
const EnquiryContext = createContext(null)
const STORAGE_KEY = 'radium-enquiry'

/** Accessories used with a product family, straight from the JSON catalogue. */
export const accessoriesFor = (slug) =>
  accessoriesData.accessories.filter((a) => a.for.includes(slug))

const load = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(raw) ? raw.filter((i) => i?.id && i?.name && i?.qty > 0) : []
  } catch {
    return []
  }
}

export function EnquiryProvider({ children }) {
  const [items, setItems] = useState(load)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* storage full or blocked — the in-memory list still works */
    }
  }, [items])

  const add = useCallback((item) => {
    setItems((cur) => {
      const found = cur.find((i) => i.id === item.id)
      if (found) return cur.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
      return [...cur, { ...item, qty: 1 }]
    })
  }, [])

  const setQty = useCallback((id, qty) => {
    setItems((cur) => (qty <= 0 ? cur.filter((i) => i.id !== id) : cur.map((i) => (i.id === id ? { ...i, qty } : i))))
  }, [])

  const remove = useCallback((id) => setItems((cur) => cur.filter((i) => i.id !== id)), [])
  const clear = useCallback(() => setItems([]), [])
  const openDrawer = useCallback(() => setDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  const value = useMemo(
    () => ({
      items,
      add,
      setQty,
      remove,
      clear,
      has: (id) => items.some((i) => i.id === id),
      qtyOf: (id) => items.find((i) => i.id === id)?.qty ?? 0,
      count: items.reduce((n, i) => n + i.qty, 0),
      drawerOpen,
      openDrawer,
      closeDrawer,
    }),
    [items, add, setQty, remove, clear, drawerOpen, openDrawer, closeDrawer]
  )

  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>
}

export const useEnquiry = () => useContext(EnquiryContext)

/** The enquiry list as plain text, used to pre-fill the contact form. */
export const enquiryAsText = (items) =>
  items.map((i) => `- ${i.qty} × ${i.name}${i.meta ? ` (${i.meta})` : ''}`).join('\n')
