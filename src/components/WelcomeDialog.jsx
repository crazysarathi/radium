import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from './ui'

const STORAGE_KEY = 'radium:welcome-seen'

/**
 * The Radium "half-circle atom" — the mark's arc fan and sweeping dot rings,
 * recoloured for the dark glass and blown up as the dialog's hero backdrop.
 * Same geometry and ring timings as /favicon.svg, radiating from the
 * bottom-left corner (arc centre 1,67 in the 70-unit tile).
 */
function AtomFan({ className }) {
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
    </svg>
  )
}

export default function WelcomeDialog() {
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
        className="glass relative grid w-full max-w-5xl overflow-hidden shadow-card ring-1 ring-inset ring-white/5 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-500 md:min-h-[440px] md:grid-cols-[minmax(0,380px),1fr]"
      >
        {/* Visual panel — the big atom, full bleed */}
        <div className="relative h-44 overflow-hidden bg-gradient-to-br from-ink-700 to-ink-800 md:h-auto md:border-r md:border-white/5">
          <AtomFan className="pointer-events-none absolute -bottom-10 -left-10 h-[420px] w-[420px] [filter:drop-shadow(0_0_10px_rgba(255,77,94,.45))] md:h-[560px] md:w-[560px]" />
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

            <div className="mt-6 flex flex-wrap gap-2">
              {['Compute', 'Storage', 'Workstations', 'Edge & IoMT'].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-beam/25 bg-beam/[.07] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-foreground/80"
                >
                  {chip}
                </span>
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
