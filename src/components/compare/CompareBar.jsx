import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { X, GitCompare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCompare } from './CompareContext'
import { getProduct, cardBullets, categoryLabel } from '@/data/products'
import { ProductImage } from '../ProductGallery'
import { cn } from '@/lib/utils'

/** Rows shown in the side-by-side comparison. */
const ATTRS = [
  ['Series', (p) => p.series],
  ['Category', (p) => categoryLabel(p.category)],
  ['Form factor', (p) => p.formFactor],
  ['Availability', (p) => (p.status === 'available' ? 'Available' : 'Roadmap')],
  ['Notes', (p) => p.note || '—'],
]

function CompareModal({ products, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Compare products"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
        className="glass max-h-[90vh] w-full max-w-4xl overflow-auto rounded-t-2xl p-6 sm:rounded-2xl md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="t-h3 text-foreground">Compare products</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg border border-white/10 p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr>
                <th className="w-28" />
                {products.map((p) => (
                  <th key={p.slug} className="p-3 align-bottom">
                    <div className="overflow-hidden rounded-lg bg-[#160607]/50 p-2">
                      <ProductImage product={p} className="aspect-[360/236] w-full" />
                    </div>
                    <Link to={`/products/${p.slug}`} onClick={onClose} className="mt-2 block font-bold text-foreground hover:text-beam">
                      {p.name}
                    </Link>
                    <p className="text-[12px] text-beam/80">{p.tagline}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[.06]">
              {ATTRS.map(([label, get]) => (
                <tr key={label}>
                  <th scope="row" className="py-3 pr-3 text-left text-[11.5px] uppercase tracking-[.1em] text-muted-foreground/85">
                    {label}
                  </th>
                  {products.map((p) => (
                    <td key={p.slug} className="p-3 align-top text-[13px] text-foreground/90">
                      {get(p)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <th scope="row" className="py-3 pr-3 text-left align-top text-[11.5px] uppercase tracking-[.1em] text-muted-foreground/85">
                  Highlights
                </th>
                {products.map((p) => (
                  <td key={p.slug} className="p-3 align-top">
                    <ul className="space-y-1">
                      {cardBullets(p).map((b) => (
                        <li key={b} className="flex gap-1.5 text-[12.5px] text-muted-foreground">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-beam/70" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

export default function CompareBar() {
  const compare = useCompare()
  const [open, setOpen] = useState(false)
  if (!compare) return null

  const products = compare.items.map(getProduct).filter(Boolean)

  return (
    <>
      <AnimatePresence>
        {products.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
            className="fixed inset-x-0 bottom-0 z-[55] flex justify-center px-4 pb-4"
          >
            <div className="glass flex items-center gap-3 px-4 py-3 shadow-card">
              <span className="hidden text-[11.5px] uppercase tracking-[.14em] text-muted-foreground sm:block">Compare</span>
              <div className="flex items-center gap-2">
                {products.map((p) => (
                  <div key={p.slug} className="relative">
                    <div className="h-11 w-16 overflow-hidden rounded-md border border-white/10 bg-[#160607]/60">
                      <ProductImage product={p} className="h-full w-full" />
                    </div>
                    <button
                      type="button"
                      onClick={() => compare.remove(p.slug)}
                      aria-label={`Remove ${p.name}`}
                      className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-beam text-[#160607]"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))}
                {Array.from({ length: Math.max(0, 2 - products.length) }).map((_, i) => (
                  <div key={i} className="hidden h-11 w-16 rounded-md border border-dashed border-white/[.12] sm:block" />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setOpen(true)}
                disabled={products.length < 2}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-lg bg-accent-grad px-4 py-2 text-[13px] font-semibold text-[#160607] transition-opacity',
                  products.length < 2 && 'cursor-not-allowed opacity-40'
                )}
              >
                <GitCompare className="h-4 w-4" /> Compare ({products.length})
              </button>
              <button type="button" onClick={compare.clear} className="text-[12px] text-muted-foreground transition-colors hover:text-foreground">
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {open && products.length >= 2 && <CompareModal products={products} onClose={() => setOpen(false)} />}
    </>
  )
}
