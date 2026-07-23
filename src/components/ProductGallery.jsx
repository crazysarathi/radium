/**
 * Product media — manufacturer catalogue photography only.
 *
 * Two photo sources, tried in order:
 *   1. Catalogue shots declared per family in `src/data/productImages.js`
 *      (downloaded from AIC into `public/products/<slug>/`).
 *   2. Extra local photography dropped into `public/products/<slug>/<view>.<ext>`
 *      without a data entry — auto-discovered, deduped against the declared set.
 * A family with no photos shows a reserved empty panel — fill it by adding a
 * file + data entry. No generated artwork.
 *
 *   ProductImage   — single image (cards, listings, solutions)
 *   ProductGallery — AIC-style viewer: vertical thumbnail rail + arrows,
 *                    click-to-open fullscreen lightbox with side navigation
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ImageOff, Maximize2, X } from 'lucide-react'
import { imagesFor } from '@/data/productImages'
import { cn } from '@/lib/utils'

/** Standard angles, mirrored to AIC's front / front-45 / rear / top set. */
const VIEWS = [
  { id: 'front-45', label: 'Front 45°' },
  { id: 'front', label: 'Front' },
  { id: 'rear', label: 'Rear' },
  { id: 'top', label: 'Top open' },
]
const EXTS = ['jpg', 'png', 'webp']

/** Candidate file paths for a view, most-specific first (per-SKU, then family). */
function candidates(product, model, viewId) {
  const bases = []
  if (product && model) bases.push(`/products/${product.slug}/${model.code}`)
  if (product) bases.push(`/products/${product.slug}`)
  return bases.flatMap((b) => EXTS.map((e) => `${b}/${viewId}.${e}`))
}

/* ------------------------------------------------------------------ */
/* Single image — cards, listings, solutions                           */
/* ------------------------------------------------------------------ */

export function ProductImage({ product, model, viewId = 'cover', className }) {
  const cands = useMemo(() => {
    // Declared catalogue shots first, then local files for the requested view.
    const declared = imagesFor(product).map((r) => r.src)
    const ids = viewId === 'cover' ? ['cover', 'front-45'] : [viewId]
    return [...new Set([...declared.slice(0, 1), ...ids.flatMap((id) => candidates(product, model, id)), ...declared.slice(1)])]
  }, [product?.slug, model?.code, viewId]) // eslint-disable-line react-hooks/exhaustive-deps
  const [i, setI] = useState(0)
  const [loaded, setLoaded] = useState(false)

  // Reset when the product or requested view changes so a new candidate list
  // doesn't inherit a failed index.
  useEffect(() => {
    setI(0)
    setLoaded(false)
  }, [product?.slug, model?.code, viewId]) // eslint-disable-line react-hooks/exhaustive-deps

  const src = i < cands.length ? cands[i] : null
  const showPhoto = Boolean(src) && loaded

  // White studio panel once a photo loads; until then the space is reserved —
  // a faint camera-off mark, no stand-in artwork.
  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden',
        showPhoto ? 'bg-white' : 'bg-white/[.02]',
        className
      )}
    >
      {!showPhoto && <ImageOff aria-hidden className="h-1/4 max-h-6 w-auto text-white/15" />}
      {src && (
        <img
          src={src}
          alt={product?.name ?? 'Radium hardware'}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false)
            setI((n) => n + 1)
          }}
          // opacity, not display:none — a lazy image with no layout box is
          // never fetched by the browser, so onLoad would never fire.
          className={cn(
            'absolute inset-0 block h-full w-full object-contain p-[5%] transition-opacity',
            showPhoto ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Fullscreen lightbox — opened by clicking the gallery's main image   */
/* ------------------------------------------------------------------ */

function Lightbox({ slides, index, title, onClose, onStep }) {
  const many = slides.length > 1
  const dialogRef = useRef(null)

  // aria-modal hides the rest of the page from assistive tech, so focus must
  // move into the dialog on open, stay inside it (Tab wraps), and return to
  // the trigger on close.
  useEffect(() => {
    const opener = document.activeElement
    dialogRef.current?.focus()
    return () => opener?.focus?.()
  }, [])

  // Escape / arrow keys, Tab trap, and lock page scroll while open.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') onStep(-1)
      else if (e.key === 'ArrowRight') onStep(1)
      else if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll('button, [tabindex]:not([tabindex="-1"])')
        if (!focusables.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        const inside = dialogRef.current.contains(document.activeElement)
        if (!inside) {
          e.preventDefault()
          first.focus()
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose, onStep])

  const s = slides[index]

  // Portal to <body> — ancestor reveal-animation transforms would otherwise
  // trap this fixed overlay inside the gallery card.
  return createPortal(
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — image viewer`}
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 outline-none"
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <p className="min-w-0 truncate text-[13px] font-semibold text-white/90">
          {title} <span className="ml-2 font-normal text-white/50">{s.label}</span>
        </p>
        <div className="flex items-center gap-4">
          {many && (
            <span className="text-[12px] tabular-nums text-white/50">
              {index + 1} / {slides.length}
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close viewer"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stage — scrollable so oversized shots can still be inspected */}
      <div className="no-scrollbar relative min-h-0 flex-1 overflow-auto">
        <div className="flex min-h-full items-center justify-center p-4 sm:p-8">
          <img
            src={s.src}
            alt={`${title} — ${s.label}`}
            referrerPolicy="no-referrer"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[82vh] w-auto max-w-full rounded-lg bg-white object-contain p-4"
          />
        </div>

        {/* Side navigation — only when there is more to see */}
        {many && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation()
                onStep(-1)
              }}
              className="fixed left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/80 backdrop-blur transition-colors hover:border-white/40 hover:text-white sm:left-6"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation()
                onStep(1)
              }}
              className="fixed right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white/80 backdrop-blur transition-colors hover:border-white/40 hover:text-white sm:right-6"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {many && (
        <div className="no-scrollbar flex justify-center gap-2 overflow-x-auto px-5 py-4">
          {slides.map((t, i) => (
            <button
              key={t.id}
              type="button"
              aria-label={t.label}
              aria-pressed={i === index}
              onClick={(e) => {
                e.stopPropagation()
                onStep(i - index)
              }}
              className={cn(
                'h-12 w-16 shrink-0 overflow-hidden rounded-md border bg-white p-0.5 transition-opacity',
                i === index ? 'border-beam/70 opacity-100' : 'border-transparent opacity-50 hover:opacity-90'
              )}
            >
              <img src={t.src} alt="" referrerPolicy="no-referrer" className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  )
}

/* ------------------------------------------------------------------ */
/* Multi-angle gallery — product detail pages                          */
/* ------------------------------------------------------------------ */

/** Preload each local view and resolve the first working source (or drop it). */
function useResolvedPhotos(product, model) {
  const key = `${product?.slug ?? ''}|${model?.code ?? ''}`
  const [photos, setPhotos] = useState([])

  useEffect(() => {
    if (!product) {
      setPhotos([])
      return undefined
    }
    let alive = true
    const results = new Array(VIEWS.length).fill(undefined)
    let done = 0
    const finish = (idx, val) => {
      results[idx] = val
      done += 1
      if (done === VIEWS.length && alive) setPhotos(results.filter(Boolean))
    }
    VIEWS.forEach((v, idx) => {
      const cands = candidates(product, model, v.id)
      const tryOne = (ci) => {
        if (ci >= cands.length) return finish(idx, null)
        const img = new Image()
        img.onload = () => finish(idx, { ...v, src: cands[ci] })
        img.onerror = () => tryOne(ci + 1)
        img.src = cands[ci]
        return undefined
      }
      tryOne(0)
    })
    setPhotos([])
    return () => {
      alive = false
    }
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps

  return photos
}

export default function ProductGallery({ product, model, className, caption }) {
  const localPhotos = useResolvedPhotos(product, model)
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)
  // Remote URLs that failed to load this session — dropped from the slide list.
  const [dead, setDead] = useState(() => new Set())

  useEffect(() => {
    setActive(0)
    setOpen(false)
    setDead(new Set())
  }, [product?.slug, model?.code]) // eslint-disable-line react-hooks/exhaustive-deps

  const declared = imagesFor(product)
  const remote = declared.filter((r) => !dead.has(r.src))

  // Declared catalogue shots first, then any extra undeclared local
  // photography — deduped so a probed file never repeats a declared one.
  const declaredSrcs = new Set(declared.map((r) => r.src))
  const extras = localPhotos.filter((p) => !declaredSrcs.has(p.src))
  const slides = [...remote.map((p) => ({ ...p })), ...extras.map((p) => ({ ...p }))]
  const idx = Math.min(active, Math.max(slides.length - 1, 0))
  const current = slides[idx]
  const hasRail = slides.length > 1
  const title = product?.name ?? 'Radium hardware'

  // Navigate from the clamped display index, never the raw state — after a
  // dead slide is dropped, raw `active` can sit past the end of `slides`.
  const step = (dir) => setActive(Math.min(Math.max(idx + dir, 0), slides.length - 1))
  // Lightbox navigation wraps so the side arrows always lead somewhere.
  const stepWrap = (dir) => setActive((idx + dir + slides.length) % slides.length)
  const dropDead = (src) =>
    setDead((prev) => {
      const next = new Set(prev)
      next.add(src)
      return next
    })

  /* No photography yet — hold the space open, to be filled later. */
  if (!current) {
    return (
      <div className={className}>
        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[.02]">
          <p className="text-[12px] uppercase tracking-[.14em] text-muted-foreground/70">
            Product photography to follow
          </p>
        </div>
        {caption && <p className="mt-4 border-t border-white/[.06] pt-4 text-[12px] text-muted-foreground">{caption}</p>}
      </div>
    )
  }

  return (
    <div className={className}>
      <div className={cn('flex gap-3', hasRail ? 'flex-col-reverse sm:flex-row' : '')}>
        {/* AIC-style rail: vertical thumbnails + up/down steppers */}
        {hasRail && (
          <div className="flex shrink-0 flex-row items-center gap-2 sm:w-20 sm:flex-col">
            <div className="no-scrollbar flex max-h-[340px] flex-row gap-2 overflow-x-auto sm:flex-col sm:overflow-y-auto">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={s.label}
                  aria-pressed={i === idx}
                  className={cn(
                    'flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white p-1 transition-colors',
                    i === idx ? 'border-beam/60' : 'border-white/10 opacity-80 hover:border-beam/40 hover:opacity-100'
                  )}
                >
                  <img
                    src={s.src}
                    alt={s.label}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={() => s.remote && dropDead(s.src)}
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => step(-1)}
                disabled={idx === 0}
                aria-label="Previous view"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-beam transition-colors hover:border-beam/40 hover:bg-beam/10 disabled:opacity-30 sm:h-8 sm:w-9"
              >
                <ChevronUp className="hidden h-4 w-4 sm:block" />
                <ChevronLeft className="h-4 w-4 sm:hidden" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                disabled={idx === slides.length - 1}
                aria-label="Next view"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-beam transition-colors hover:border-beam/40 hover:bg-beam/10 disabled:opacity-30 sm:h-8 sm:w-9"
              >
                <ChevronDown className="hidden h-4 w-4 sm:block" />
                <ChevronRight className="h-4 w-4 sm:hidden" />
              </button>
            </div>
          </div>
        )}

        {/* Main stage — click to open the fullscreen viewer */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Open ${title} image viewer`}
          className="group relative flex min-h-[280px] flex-1 cursor-zoom-in items-center justify-center overflow-hidden rounded-xl bg-white"
        >
          <img
            src={current.src}
            alt={`${title} — ${current.label}`}
            referrerPolicy="no-referrer"
            onError={() => current.remote && dropDead(current.src)}
            className="block max-h-[440px] w-full object-contain p-6"
          />
          <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            <Maximize2 className="h-4 w-4" />
          </span>
        </button>
      </div>

      {caption && <p className="mt-4 border-t border-white/[.06] pt-4 text-[12px] text-muted-foreground">{caption}</p>}

      {open && (
        <Lightbox slides={slides} index={idx} title={title} onClose={() => setOpen(false)} onStep={stepWrap} />
      )}
    </div>
  )
}
