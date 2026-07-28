import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Search, X } from 'lucide-react'
import { products, jupiterModels, categoryLabel } from '@/data/products'
import { chassisModels } from '@/data/chassis'
import { productImages } from '@/data/productImages'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Search index — built once from the same catalogue data that renders */
/* the product pages, so results can never point at a missing page.    */
/* ------------------------------------------------------------------ */

const INDEX = (() => {
  const entries = []

  for (const p of products) {
    entries.push({
      key: `family-${p.slug}`,
      kind: p.status === 'roadmap' ? 'Roadmap' : 'Series',
      title: p.name,
      subtitle: [p.tagline, p.formFactor].filter(Boolean).join(' · '),
      to: `/products/${p.slug}`,
      img: productImages[p.slug]?.[0]?.src ?? null,
      haystack: [p.name, p.series, p.tagline, p.note, p.formFactor, categoryLabel(p.category)]
        .filter(Boolean)
        .join(' ')
        .toLowerCase(),
    })
  }

  for (const m of jupiterModels) {
    entries.push({
      key: m.id,
      kind: 'Model',
      title: m.name,
      subtitle: `${m.rackUnits} · ${m.bays} bays · ${m.rawCapacityTb} TB raw`,
      to: `/products/jupiter/${m.code}`,
      img: productImages.jupiter?.[0]?.src ?? null,
      haystack: `${m.name} ${m.code} storage server san nas jupiter ss`.toLowerCase(),
    })
  }

  for (const [familySlug, models] of Object.entries(chassisModels)) {
    const family = products.find((p) => p.slug === familySlug)
    for (const m of models) {
      entries.push({
        key: m.id,
        kind: 'Model',
        title: m.model,
        subtitle: `${m.ru} · ${family?.name ?? familySlug}`,
        to: `/products/${familySlug}#${m.id}`,
        img: m.img,
        haystack: `${m.model} ${m.id} ${m.ru} ${family?.name ?? ''} ${m.bullets.join(' ')}`.toLowerCase(),
      })
    }
  }

  return entries
})()

/** Every query token must match; rank title hits above spec-text hits. */
function searchIndex(query) {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return []

  const scored = []
  for (const e of INDEX) {
    let score = 0
    let ok = true
    for (const t of tokens) {
      const title = e.title.toLowerCase()
      if (title.startsWith(t)) score += 0
      else if (title.includes(t)) score += 1
      else if (e.haystack.includes(t)) score += 4
      else {
        ok = false
        break
      }
    }
    if (ok) scored.push([score, e])
  }
  return scored
    .sort((a, b) => a[0] - b[0] || a[1].title.localeCompare(b[1].title))
    .slice(0, 9)
    .map(([, e]) => e)
}

function Highlight({ text, query }) {
  const q = query.trim().toLowerCase()
  const at = q ? text.toLowerCase().indexOf(q.split(/\s+/)[0]) : -1
  if (at < 0) return text
  const len = q.split(/\s+/)[0].length
  return (
    <>
      {text.slice(0, at)}
      <span className="text-beam">{text.slice(at, at + len)}</span>
      {text.slice(at + len)}
    </>
  )
}

export default function SearchPalette({ open, onClose }) {
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const results = useMemo(() => (query.trim() ? searchIndex(query) : []), [query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      // Focus after the overlay paints.
      const t = setTimeout(() => inputRef.current?.focus(), 30)
      return () => clearTimeout(t)
    }
    return undefined
  }, [open])

  useEffect(() => setActive(0), [query])

  useEffect(() => {
    if (!open) return undefined
    // Lenis drives the page scroll from window wheel events, so hiding body
    // overflow alone doesn't stop the page moving behind the dialog. The
    // page scrollbar lives on <html>, so lock that too.
    window.__lenis?.stop()
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      window.__lenis?.start()
    }
  }, [open])

  if (!open) return null

  const go = (entry) => {
    onClose()
    navigate(entry.to)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[active]) go(results[active])
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[999] overflow-y-auto bg-[#0a0305]/80 px-4 pb-10 pt-[96px] backdrop-blur-sm sm:pt-[120px]"
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative mx-auto w-full max-w-xl origin-top animate-dropdown-in overflow-hidden rounded-glass border border-white/[.08] bg-[#120406]/95 shadow-[0_40px_90px_-24px_rgba(0,0,0,.9)] backdrop-blur-2xl">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-beam/50 to-transparent"
        />

        <div className={cn('flex items-center gap-3 px-5', query.trim() && 'border-b border-white/[.07]')}>
          <Search className="h-4 w-4 shrink-0 text-beam" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search products — Mercury, Jupiter SS 161616, RSC-4H…"
            className="h-14 w-full bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground/60"
            aria-label="Search products"
          />
          <button
            type="button"
            aria-label="Close search"
            onClick={onClose}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition-colors hover:border-beam/40 hover:text-beam"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {query.trim() && (
        <div ref={listRef} className="max-h-[min(52vh,420px)] overflow-y-auto overscroll-contain p-2">
          {results.length === 0 && (
            <div className="px-3 py-10 text-center text-sm text-muted-foreground">
              No products match “{query}”.
              <button
                type="button"
                onClick={() => {
                  onClose()
                  navigate('/products')
                }}
                className="mx-auto mt-3 flex items-center gap-1.5 text-beam hover:underline"
              >
                Browse all products <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          {results.map((r, i) => (
            <button
              key={r.key}
              type="button"
              onClick={() => go(r)}
              onMouseEnter={() => setActive(i)}
              className={cn(
                'flex w-full items-center gap-4 rounded-xl px-3 py-2.5 text-left transition-colors',
                i === active ? 'bg-beam/10' : 'hover:bg-beam/5'
              )}
            >
              <span className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#cfcfcf]">
                {r.img ? (
                  <img src={r.img} alt="" loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <Search className="h-4 w-4 text-ink-900/40" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-foreground">
                  <Highlight text={r.title} query={query} />
                </span>
                <span className="mt-0.5 block truncate text-[12px] text-muted-foreground">{r.subtitle}</span>
              </span>
              <span className="shrink-0 rounded-full border border-white/10 px-2 py-px text-[9px] uppercase tracking-widest text-muted-foreground">
                {r.kind}
              </span>
            </button>
          ))}
        </div>
        )}
      </div>
    </div>
  )
}
