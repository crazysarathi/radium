import { createContext, useCallback, useContext, useMemo, useState } from 'react'

/**
 * Product comparison state — AIC-style "Compare" tray. Holds up to MAX product
 * slugs; cards toggle membership, the floating CompareBar renders the tray and
 * the side-by-side table.
 */
const CompareContext = createContext(null)
const MAX = 4

export function CompareProvider({ children }) {
  const [items, setItems] = useState([])

  const toggle = useCallback((slug) => {
    setItems((cur) => {
      if (cur.includes(slug)) return cur.filter((s) => s !== slug)
      if (cur.length >= MAX) return cur
      return [...cur, slug]
    })
  }, [])
  const remove = useCallback((slug) => setItems((cur) => cur.filter((s) => s !== slug)), [])
  const clear = useCallback(() => setItems([]), [])

  const value = useMemo(
    () => ({ items, toggle, remove, clear, has: (s) => items.includes(s), max: MAX }),
    [items, toggle, remove, clear]
  )

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
}

export const useCompare = () => useContext(CompareContext)
