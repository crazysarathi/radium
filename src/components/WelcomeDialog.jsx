import { useEffect, useMemo, useRef, useState } from 'react'
import { Activity, ArrowRight, Cpu, HardDrive, MonitorDot } from 'lucide-react'
import { Button } from './ui'
import { useCatalogue } from '@/context/CatalogueContext'

const STORAGE_KEY = 'radium:welcome-seen'

/** Category cards filling the content panel — one per line of the range. */
const CATEGORIES = [
  { icon: Cpu, label: 'Compute', desc: 'Mercury high-performance computers for PACS & VNA cores.' },
  { icon: HardDrive, label: 'Storage', desc: 'Jupiter & Saturn SAN/NAS servers with Io expansion pods.' },
  { icon: MonitorDot, label: 'Workstations', desc: 'Neptune & Mars desktops for the reading room.' },
  { icon: Activity, label: 'IoMT', desc: 'Pluto gateways connecting devices at the modality.' },
]

/* ------------------------------------------------------------------ */
/* Product spotlight orbit                                             */
/* ------------------------------------------------------------------ */

/** Radii for each featured family's ring — alternating inner/outer so
 *  consecutive spotlights hop between rings instead of marching along one arc. */
const ORBIT_RADII = [
  { slug: 'mercury', radius: 20 },
  { slug: 'jupiter', radius: 44 },
  { slug: 'io', radius: 28 },
  { slug: 'saturn', radius: 38 },
  { slug: 'neptune', radius: 24 },
  { slug: 'mars', radius: 41 },
  { slug: 'pluto', radius: 32 },
]

/**
 * One satellite ball per product family, orbiting the fan's corner on its
 * own ring — built from the live catalogue so taglines stay in sync with
 * the API instead of a module-scope snapshot of the old static array.
 */
function useFeaturedOrbits(products) {
  return useMemo(
    () =>
      ORBIT_RADII.map((o) => {
        const p = products.find((p) => p.slug === o.slug)
        const tagline = p?.tagline ?? ''
        // Long taglines get cut at a word boundary so the label stays inside the tile.
        const sub = (tagline.length > 26 ? `${tagline.slice(0, 26).replace(/\s+\S*$/, '')}…` : tagline).toUpperCase()
        return { ...o, name: p?.name ?? o.slug, sub }
      }),
    [products]
  )
}

const ORBIT_CX = 1
const ORBIT_CY = 67
const ORBIT_COUNT = ORBIT_RADII.length
/** Stage wedge: exactly one satellite inside it at any moment. */
const WEDGE = 360 / ORBIT_COUNT
const WEDGE_START = 45 - WEDGE / 2
/** Deg/sec — each ball holds the stage for ~3s before handing over. */
const ORBIT_SPEED = WEDGE / 3
/** Seconds per product when motion is reduced (crossfade only). */
const STILL_SLOT = 4

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
const smoothstep = (v) => v * v * (3 - 2 * v)

function ProductOrbit({ orbits, reduceMotion }) {
  const itemsRef = useRef([])
  const startRef = useRef(null)

  useEffect(() => {
    let raf
    const tick = (now) => {
      if (startRef.current == null) startRef.current = now
      const t = (now - startRef.current) / 1000
      const stillIndex = Math.floor(t / STILL_SLOT) % ORBIT_COUNT

      orbits.forEach((orbit, i) => {
        const el = itemsRef.current[i]
        if (!el?.sat) return

        // Angle from vertical, sweeping clockwise into the fan (matches the rings)
        let theta
        let env = 0
        if (reduceMotion) {
          theta = 15 + (i * 60) / (ORBIT_COUNT - 1)
          if (i === stillIndex) {
            const tau = t % STILL_SLOT
            env = smoothstep(clamp(Math.min(tau, STILL_SLOT - tau) / 0.6, 0, 1))
          }
        } else {
          theta = WEDGE_START - 6 - i * WEDGE + ORBIT_SPEED * t
          const norm = ((theta % 360) + 360) % 360
          const p = (norm - WEDGE_START) / WEDGE
          if (p >= 0 && p <= 1) env = smoothstep(clamp(Math.min(p, 1 - p) / 0.16, 0, 1))
        }

        const rad = (theta * Math.PI) / 180
        const x = ORBIT_CX + orbit.radius * Math.sin(rad)
        const y = ORBIT_CY - orbit.radius * Math.cos(rad)
        const dotR = 1.3 + (reduceMotion ? 0.9 : 2.1) * env

        el.sat.setAttribute('cx', x)
        el.sat.setAttribute('cy', y)
        el.sat.setAttribute('r', dotR)

        el.callout.setAttribute('opacity', env)
        if (env <= 0.01) return

        // Label anchored radially outward from the ball, clamped into view
        const halfW = Math.max(orbit.name.length * 0.93, orbit.sub.length * 0.77)
        const lx = clamp(ORBIT_CX + (orbit.radius + 10) * Math.sin(rad), halfW + 6, 51 - halfW)
        const ly = clamp(ORBIT_CY - (orbit.radius + 10) * Math.cos(rad), 14, 58)
        el.text.setAttribute('x', lx)
        el.text.setAttribute('y', ly - 2)
        if (el.sub) {
          el.sub.setAttribute('x', lx)
          el.sub.setAttribute('y', ly + 0.6)
        }

        // Leader arrow from the label to the rim of the zoomed ball
        const dx = x - lx
        const dy = y - ly
        const len = Math.hypot(dx, dy) || 1
        const rim = dotR + 1.9
        el.line.setAttribute('x1', lx)
        el.line.setAttribute('y1', ly + (orbit.sub ? 2.1 : 0.8))
        el.line.setAttribute('x2', x - (dx / len) * rim)
        el.line.setAttribute('y2', y - (dy / len) * rim)

        el.halo.setAttribute('cx', x)
        el.halo.setAttribute('cy', y)
        el.halo.setAttribute('r', dotR + 1.6)
        el.halo.setAttribute('opacity', 0.9 * env)
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // Restart (re-close over fresh names/taglines) whenever the catalogue
    // resolves — orbits starts as slug-only fallbacks before the fetch lands.
  }, [orbits, reduceMotion])

  const bindRef = (i, key) => (node) => {
    ;(itemsRef.current[i] ??= {})[key] = node
  }

  return (
    <g className="hidden md:block">
      <defs>
        <marker
          id="wd-spot-arrow"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0 0 L6 3 L0 6 z" fill="#ff97a1" />
        </marker>
      </defs>
      {orbits.map((orbit, i) => (
        <g key={orbit.slug}>
          <circle ref={bindRef(i, 'sat')} r="1.3" fill="#ffb3ba" />
          <g ref={bindRef(i, 'callout')} opacity="0">
            <circle
              ref={bindRef(i, 'halo')}
              fill="none"
              stroke="rgba(255,151,161,.85)"
              strokeWidth=".35"
            />
            <line
              ref={bindRef(i, 'line')}
              stroke="rgba(255,151,161,.9)"
              strokeWidth=".3"
              markerEnd="url(#wd-spot-arrow)"
            />
            <text
              ref={bindRef(i, 'text')}
              fill="#fff"
              fontSize="3"
              fontWeight="600"
              textAnchor="middle"
              stroke="rgba(24,7,10,.55)"
              strokeWidth=".5"
              style={{ paintOrder: 'stroke' }}
            >
              {orbit.name}
            </text>
            {orbit.sub ? (
              <text
                ref={bindRef(i, 'sub')}
                fill="rgba(255,179,186,.92)"
                fontSize="2"
                fontWeight="600"
                letterSpacing=".28"
                textAnchor="middle"
                stroke="rgba(24,7,10,.55)"
                strokeWidth=".45"
                style={{ paintOrder: 'stroke' }}
              >
                {orbit.sub}
              </text>
            ) : null}
          </g>
        </g>
      ))}
    </g>
  )
}

/**
 * The Radium "half-circle atom" — the mark's arc fan and sweeping dot rings,
 * recoloured for the dark glass and blown up as the dialog's hero backdrop.
 * Same geometry and ring timings as /favicon.svg, radiating from the
 * bottom-left corner (arc centre 1,67 in the 70-unit tile).
 */
function AtomFan({ className, orbits }) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const spin = (dur) =>
    !reduceMotion && (
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 1 67"
        to="90 1 67"
        dur={dur}
        repeatCount="indefinite"
      />
    )

  return (
    <svg viewBox="0 0 70 70" className={className} aria-hidden>
      <defs>
        <g id="wd-s2" fill="currentColor">
          <circle cx="14" cy="52" r="1.3" />
          <circle cx="20" cy="68" r="1.3" />
        </g>
        <g id="wd-s3" fill="currentColor">
          <circle cx="8" cy="42" r="1.3" />
          <circle cx="16" cy="47" r="1.3" />
          <circle cx="22" cy="54" r="1.3" />
          <circle cx="25" cy="62" r="1.3" />
        </g>
        <g id="wd-s4" fill="currentColor">
          <circle cx="6" cy="36" r="1.3" />
          <circle cx="12" cy="38" r="1.3" />
          <circle cx="17" cy="40" r="1.3" />
          <circle cx="21" cy="45" r="1.3" />
          <circle cx="25" cy="50" r="1.3" />
          <circle cx="28" cy="55" r="1.3" />
          <circle cx="30" cy="61" r="1.3" />
          <circle cx="31" cy="68" r="1.3" />
        </g>
        <g id="wd-s5" fill="currentColor">
          <circle cx="12" cy="32" r="1.3" />
          <circle cx="23" cy="39" r="1.3" />
          <circle cx="31" cy="49" r="1.3" />
          <circle cx="36" cy="61" r="1.3" />
        </g>
        <g id="wd-s6" fill="currentColor">
          <circle cx="29" cy="37" r="1.3" />
          <circle cx="42" cy="68" r="1.3" />
        </g>
        {['wd-s2', 'wd-s3', 'wd-s4', 'wd-s5', 'wd-s6'].map((s, i) => (
          <g id={`wd-r${i + 2}`} key={s}>
            <use href={`#${s}`} />
            <use href={`#${s}`} transform="rotate(90 1 67)" />
            <use href={`#${s}`} transform="rotate(180 1 67)" />
            <use href={`#${s}`} transform="rotate(270 1 67)" />
          </g>
        ))}
      </defs>

      {/* Half-circle arcs radiating from the corner */}
      <g fill="rgba(255,77,94,.30)">
        <path d="M1 51a16 16 0 0 1 14 17v-2Q14 54 1 51" />
        <path d="M21 67v2h-1v-3A21 21 0 0 0 1 46a21 21 0 0 1 20 21" />
        <path d="M26 67v2h-1v-8A26 26 0 0 0 1 41v-1a27 27 0 0 1 25 27" />
        <path d="M31 67v2h-1zl-1-1a32 32 0 0 0-6-18l-6-6a31 31 0 0 0-17-6v-1a31 31 0 0 1 15 5l9 8a33 33 0 0 1 6 19" />
        <path d="m37 67-1 2v-2a37 37 0 0 0-6-20A37 37 0 0 0 1 31v-1a37 37 0 0 1 31 20 37 37 0 0 1 5 17" />
        <path d="M42 67v2h-1zv-1A42 42 0 0 0 1 25v-1a42 42 0 0 1 41 42z" />
        <path d="M47 67v2h-1zc0-25-20-46-45-47v-1c26 1 46 22 46 48" />
      </g>

      {/* Rings of dots sweeping along the arcs */}
      <g className="text-[#ff97a1]">
        <g>
          {spin('7s')}
          <use href="#wd-r2" />
        </g>
        <g>
          {spin('9s')}
          <use href="#wd-r3" />
        </g>
        <g>
          {spin('11s')}
          <use href="#wd-r4" />
        </g>
        <g>
          {spin('13.5s')}
          <use href="#wd-r5" />
        </g>
        <g>
          {spin('16s')}
          <use href="#wd-r6" />
        </g>
      </g>

      {/* Product spotlight — one ball at a time zooms with an arrow + name */}
      <ProductOrbit orbits={orbits} reduceMotion={reduceMotion} />
    </svg>
  )
}

export default function WelcomeDialog() {
  const catalogue = useCatalogue()
  const orbits = useFeaturedOrbits(catalogue?.products ?? [])
  const [open, setOpen] = useState(false)
  const okRef = useRef(null)

  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      /* storage unavailable — show anyway */
    }
    if (seen) return
    const t = setTimeout(() => setOpen(true), 600)
    return () => clearTimeout(t)
  }, [])

  const dismiss = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1')
    } catch {
      /* ignore */
    }
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    okRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && dismiss()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        aria-describedby="welcome-desc"
        className="glass relative grid w-full max-w-6xl overflow-hidden shadow-card ring-1 ring-inset ring-white/5 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-500 md:min-h-[560px] md:grid-cols-[minmax(0,440px),1fr]"
      >
        {/* Visual panel — the big atom, full bleed */}
        <div className="relative h-44 overflow-hidden bg-gradient-to-br from-ink-700 to-ink-800 md:h-auto md:border-r md:border-white/5">
          <AtomFan
            orbits={orbits}
            className="pointer-events-none absolute -bottom-10 -left-10 h-[420px] w-[420px] [filter:drop-shadow(0_0_10px_rgba(255,77,94,.45))] md:h-[660px] md:w-[660px]"
          />
          {/* Corner glow anchoring the fan */}
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-beam/30 blur-[100px]"
          />
          <img
            src="/radium-logo.svg"
            alt="Radium Computers"
            className="absolute left-6 top-6 h-9 w-auto drop-shadow-[0_2px_8px_rgba(0,0,0,.5)]"
          />
        </div>

        {/* Content — headline up top, description + actions anchored at the bottom */}
        <div className="relative flex flex-col p-7 sm:p-10">
          {/* Soft beam glow bleeding in from the top edge */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-[radial-gradient(70%_100%_at_50%_0%,rgba(255,77,94,.14),transparent_70%)]"
          />

          <div className="relative">
            <p className="t-eyebrow text-beam/80">Welcome to Radium</p>
            <h2 id="welcome-title" className="t-h2 mt-3 max-w-xl text-foreground">
              Hardware engineered for <span className="text-grad">medical imaging</span>
            </h2>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {CATEGORIES.map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="flex items-start gap-3.5 rounded-2xl border border-white/[.07] bg-white/[.03] p-4"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-beam/25 bg-beam/[.08]">
                    <Icon className="h-4 w-4 text-beam" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-foreground/90">{label}</p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-10 flex flex-1 flex-col justify-end gap-6 md:flex-row md:items-end md:justify-between">
            <p id="welcome-desc" className="max-w-md text-sm leading-relaxed text-muted-foreground">
              High-performance compute, SAN/NAS storage servers, expansion pods, workstations and
              IoMT edge devices — built for PACS, VNA and enterprise imaging workloads.
            </p>
            <div className="flex shrink-0 flex-col-reverse gap-3 sm:flex-row sm:items-center">
              <Button variant="outline" size="md" onClick={dismiss}>
                Got it
              </Button>
              <Button ref={okRef} to="/products" size="md" onClick={dismiss}>
                Explore products
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
