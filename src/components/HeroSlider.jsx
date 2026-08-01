import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductImage } from '@/components/ProductGallery'
import { Badge, Button, Magnetic } from '@/components/ui'
import { useCatalogue } from '@/context/CatalogueContext'
import { imagesFor } from '@/lib/catalogue'
import { THEMES, useThemeZone } from '@/components/ThemeField'

const AUTOPLAY_MS = 9000

/**
 * AIC-style hero carousel: full-screen slides, each with its own colour mood
 * and product shot, numbered pagination with an autoplay progress bar, and
 * prev/next arrows. The active slide's theme is pushed to the site theme
 * store, so the page backdrop re-tints with every slide.
 */
const SLIDES = [
  {
    key: 'archive',
    theme: 'crimson',
    eyebrow: 'Radium® Computer Hardware',
    title: 'Hardware built for the archive that can never go down.',
    body:
      'Compute, SAN/NAS storage, expansion pods, reading workstations and IoMT gateways — one hardware line engineered end to end for PACS, VNA and enterprise medical imaging.',
    ctas: [
      { label: 'Explore the product line', to: '/products' },
      { label: 'Request a quote', to: '/contact', outline: true },
    ],
    product: 'jupiter',
    caption: 'Jupiter SS 242016 — 24-bay storage server',
    status: 'In production',
    chips: ['12 product families', '24-bay Jupiter chassis', '99.999% uptime target'],
  },
  {
    key: 'storage',
    theme: 'crimson',
    eyebrow: 'SAN / NAS / Expansion',
    title: 'Storage that grows a drive at a time, not a forklift at a time.',
    body:
      'Jupiter storage servers and Io expansion pods scale the archive bay by bay. Read the six-digit model number and you already know the capacity runway left in the chassis.',
    ctas: [
      { label: 'Storage servers', to: '/products/jupiter' },
      { label: 'Decode a model number', href: '#model-numbers', outline: true },
    ],
    product: 'io',
    caption: 'Io JB — 24-bay expansion pod',
    status: 'Shipping now',
    chips: ['Model number = spec sheet', 'Bay-level scaling', 'One firmware baseline'],
  },
  {
    key: 'system',
    theme: 'crimson',
    eyebrow: 'IoMT',
    title: 'From modality to reading room, one vendor on the hook.',
    body:
      'IoMT gateways at the modality, the archive in the rack, workstations in the reading room — specified as one system, quoted as one path, backed by one support number.',
    ctas: [
      { label: 'Explore the product line', to: '/products' },
      { label: 'Request a quote', to: '/contact', outline: true },
    ],
    product: 'mercury',
    caption: 'Mercury RS — 1U short-depth gateway',
    status: 'Configure to order',
    chips: ['PACS / VNA / AI', 'Edge to core', 'One support number'],
  },
  {
    key: 'reading-room',
    theme: 'crimson',
    eyebrow: 'Reading Room Workstations',
    title: 'The last three feet of the archive is a desk.',
    body:
      'Neptune diagnostic desktops drive paired greyscale heads with GPU room to spare for 3D and MPR — quiet enough for the reading room, quoted alongside the rack they read from.',
    ctas: [
      { label: 'Reading workstations', to: '/products/neptune' },
      { label: 'Request a quote', to: '/contact', outline: true },
    ],
    product: 'neptune',
    caption: 'Radium Neptune — diagnostic reading and reporting desktop',
    status: 'Configure to order',
    chips: ['Multi-head displays', 'Reading-room quiet', '3D / MPR headroom'],
  },
]

const pad = (n) => String(n + 1).padStart(2, '0')

export default function HeroSlider() {
  const catalogue = useCatalogue()
  const getProduct = catalogue?.getProduct ?? (() => undefined)
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  // Bumped on every manual jump so the autoplay timer and the progress bar
  // restart together instead of drifting apart.
  const [cycle, setCycle] = useState(0)

  const slide = SLIDES[active]
  const t = THEMES[slide.theme]
  const zoneRef = useThemeZone(slide.theme)

  const go = (i) => {
    setActive((i + SLIDES.length) % SLIDES.length)
    setCycle((c) => c + 1)
  }

  useEffect(() => {
    if (reduce) return undefined
    const timer = setTimeout(() => setActive((a) => (a + 1) % SLIDES.length), AUTOPLAY_MS)
    return () => clearTimeout(timer)
  }, [active, cycle, reduce])

  // Warm the cache for every slide's cover shot so the first rotation never
  // shows an empty panel while an image streams in. Re-runs once the
  // catalogue lands (products are empty on the very first paint).
  useEffect(() => {
    SLIDES.forEach((s) => {
      const src = imagesFor(getProduct(s.product))[0]?.src
      if (src) {
        const img = new Image()
        img.src = src
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalogue?.products])

  const fadeText = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 28 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.32, ease: 'easeIn' } },
      }
  const fadeVisual = reduce
    ? {}
    : {
        initial: { opacity: 0, scale: 0.96, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.65, ease: [0.2, 0.7, 0.2, 1], delay: 0.08 } },
        exit: { opacity: 0, scale: 0.985, transition: { duration: 0.3, ease: 'easeIn' } },
      }

  return (
    <section
      ref={zoneRef}
      aria-roledescription="carousel"
      aria-label="Radium highlights"
      className="relative flex min-h-[92svh] flex-col overflow-hidden pb-10 pt-28 md:pt-32 lg:min-h-[100svh]"
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') go(active - 1)
        if (e.key === 'ArrowRight') go(active + 1)
      }}
    >
      {/* Per-slide background moods, crossfaded. */}
      {SLIDES.map((s, i) => {
        const st = THEMES[s.theme]
        return (
          <div
            key={s.key}
            aria-hidden
            className="pointer-events-none absolute inset-0 transition-opacity duration-1000 ease-out"
            style={{
              opacity: i === active ? 1 : 0,
              background:
                `radial-gradient(70% 58% at 78% 16%, rgba(${st.accent}, .12), transparent 66%), ` +
                `radial-gradient(50% 44% at 10% 84%, rgba(${st.accent}, .07), transparent 70%)`,
            }}
          />
        )
      })}
      {/* Neutral grid so every slide colour sits on the same texture. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)',
          backgroundSize: '54px 54px',
          maskImage: 'radial-gradient(78% 68% at 50% 28%, #000 0%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(78% 68% at 50% 28%, #000 0%, transparent 80%)',
        }}
      />

      <div className="container relative flex flex-1 items-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide.key}
            className="grid w-full items-center gap-12 py-8 lg:grid-cols-[1.05fr_.95fr]"
            {...fadeText}
          >
            <div>
              <p className="t-eyebrow flex items-center gap-3" style={{ color: `rgba(${t.soft}, .9)` }}>
                <span className="h-px w-6" style={{ background: `rgba(${t.accent}, .6)` }} />
                {slide.eyebrow}
              </p>
              <h1
                className="t-hero mt-5"
                style={{
                  background: `linear-gradient(135deg, #ffffff 0%, #fff 38%, rgb(${t.soft}) 76%, rgb(${t.accent}) 100%)`,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {slide.title}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-[17px]">
                {slide.body}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                {slide.ctas.map((cta) =>
                  cta.outline ? (
                    <Magnetic key={cta.label}>
                      <Button
                        to={cta.to}
                        href={cta.href}
                        variant="outline"
                        size="lg"
                        className="border-white/20 hover:border-white/50 hover:bg-white/5"
                      >
                        {cta.label}
                      </Button>
                    </Magnetic>
                  ) : (
                    <Magnetic key={cta.label}>
                      <Button
                        to={cta.to}
                        href={cta.href}
                        size="lg"
                        style={{ background: t.grad, color: t.ink, boxShadow: `0 0 22px rgba(${t.accent}, .24)` }}
                      >
                        {cta.label} <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Magnetic>
                  )
                )}
              </div>

              <ul className="mt-9 flex flex-wrap gap-2">
                {slide.chips.map((chip) => (
                  <li
                    key={chip}
                    className="rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[.12em]"
                    style={{
                      borderColor: `rgba(${t.accent}, .3)`,
                      background: `rgba(${t.accent}, .07)`,
                      color: `rgba(${t.soft}, .92)`,
                    }}
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            </div>

            <motion.div {...fadeVisual}>
              <div className="glass relative overflow-hidden shadow-card">
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-[80px]"
                  style={{ background: `radial-gradient(circle, rgba(${t.accent}, .22), transparent 70%)` }}
                />
                <div className="p-6 pb-0">
                  <div className="flex items-center justify-between">
                    <span className="t-eyebrow" style={{ color: `rgba(${t.soft}, .75)` }}>
                      Radium hardware
                    </span>
                    <Badge tone="good">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" /> {slide.status}
                    </Badge>
                  </div>
                </div>
                <div className="p-6" style={{ animation: reduce ? 'none' : 'float 8s ease-in-out infinite' }}>
                  <ProductImage product={getProduct(slide.product)} className="aspect-[4/3] w-full rounded-xl" />
                </div>
                <p className="px-6 pb-6 text-center text-[10.5px] uppercase tracking-[.14em] text-muted-foreground/85">
                  {slide.caption}
                </p>
                {[
                  'left-4 top-4 border-l border-t',
                  'right-4 top-4 border-r border-t',
                  'left-4 bottom-4 border-b border-l',
                  'right-4 bottom-4 border-b border-r',
                ].map((pos) => (
                  <span
                    key={pos}
                    className={`pointer-events-none absolute h-4 w-4 ${pos}`}
                    style={{ borderColor: `rgba(${t.accent}, .45)` }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Control rail — arrows, numbered progress pagination, slide counter. */}
      <div className="container relative mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
        <div className="flex items-center gap-2">
          {[
            { Icon: ChevronLeft, dir: -1, label: 'Previous slide' },
            { Icon: ChevronRight, dir: 1, label: 'Next slide' },
          ].map(({ Icon, dir, label }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              onClick={() => go(active + dir)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-foreground/80 transition-all hover:-translate-y-0.5 hover:text-foreground"
              style={{ '--tw-shadow': 'none' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `rgba(${t.accent}, .6)`
                e.currentTarget.style.background = `rgba(${t.accent}, .12)`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = ''
                e.currentTarget.style.background = ''
              }}
            >
              <Icon className="h-5 w-5" />
            </button>
          ))}
        </div>

        <div className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-3" role="tablist" aria-label="Slides">
          {SLIDES.map((s, i) => {
            const st = THEMES[s.theme]
            const isActive = i === active
            return (
              <button
                key={s.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Slide ${pad(i)}: ${s.eyebrow}`}
                onClick={() => go(i)}
                className="group flex items-center gap-2.5"
              >
                <span
                  className="font-mono text-[14px] font-semibold tracking-[.1em] transition-colors"
                  style={{ color: isActive ? `rgb(${st.soft})` : 'rgba(255,255,255,.35)' }}
                >
                  {pad(i)}
                </span>
                <span className="relative h-[6px] w-12 overflow-hidden rounded-full bg-white/10 transition-all group-hover:bg-white/20 md:w-24">
                  {isActive && (
                    <span
                      key={`${active}-${cycle}`}
                      className="absolute inset-0 origin-left rounded-full"
                      style={{
                        background: `rgb(${st.accent})`,
                        transform: reduce ? 'scaleX(1)' : undefined,
                        animation: reduce ? 'none' : `hero-progress ${AUTOPLAY_MS}ms linear forwards`,
                      }}
                    />
                  )}
                </span>
              </button>
            )
          })}
        </div>

        <p className="font-mono text-sm tabular-nums text-foreground/80">
          {pad(active)} <span className="text-white/25">/ {pad(SLIDES.length - 1)}</span>
        </p>
      </div>
    </section>
  )
}
