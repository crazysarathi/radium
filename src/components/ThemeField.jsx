import { useEffect, useRef, useSyncExternalStore } from 'react'

/**
 * Scroll-matched page theming (AIC-style).
 *
 * The landing page is split into zones, each declaring a colour theme. A fixed
 * backdrop behind the content crossfades its glow to the theme of whichever
 * zone currently sits under the viewport centre — so the page "mood" follows
 * the scroll. The hero slider drives the same store: each slide re-tints the
 * backdrop while the hero is on screen.
 */

export const THEMES = {
  crimson: {
    accent: '224, 55, 70',
    soft: '238, 128, 138',
    grad: 'linear-gradient(135deg, #e03746 0%, #ee5560 100%)',
    ink: '#26060a',
  },
  azure: {
    accent: '86, 146, 255',
    soft: '158, 193, 255',
    grad: 'linear-gradient(135deg, #4d8dff 0%, #6ea4ff 100%)',
    ink: '#04122b',
  },
  emerald: {
    accent: '52, 211, 153',
    soft: '134, 239, 192',
    grad: 'linear-gradient(135deg, #24c58c 0%, #4ade9f 100%)',
    ink: '#032117',
  },
  violet: {
    accent: '178, 102, 255',
    soft: '212, 168, 255',
    grad: 'linear-gradient(135deg, #a855f7 0%, #bf7bff 100%)',
    ink: '#1d0733',
  },
  amber: {
    accent: '255, 171, 64',
    soft: '255, 208, 143',
    grad: 'linear-gradient(135deg, #ffab40 0%, #ffc46e 100%)',
    ink: '#2b1503',
  },
}

/* ------------------------------------------------------------------ */
/* Store — module-level so the hero and every zone share one theme     */
/* ------------------------------------------------------------------ */

const listeners = new Set()
let current = 'crimson'

export function setSiteTheme(theme) {
  if (!THEMES[theme] || theme === current) return
  current = theme
  listeners.forEach((l) => l())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useSiteTheme() {
  return useSyncExternalStore(subscribe, () => current)
}

/* ------------------------------------------------------------------ */
/* Zones                                                               */
/* ------------------------------------------------------------------ */

/**
 * Marks the wrapped block as owning `theme` while it crosses the middle band
 * of the viewport. The theme can change while in view (the hero slider does
 * this on every slide) — the store is re-notified immediately.
 */
export function useThemeZone(theme) {
  const ref = useRef(null)
  const inView = useRef(false)
  const themeRef = useRef(theme)

  useEffect(() => {
    themeRef.current = theme
    if (inView.current) setSiteTheme(theme)
  }, [theme])

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (!('IntersectionObserver' in window)) return undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting
        if (entry.isIntersecting) setSiteTheme(themeRef.current)
      },
      // A band around the viewport centre: a zone becomes active once it
      // reaches the middle of the screen, not the moment its edge appears.
      { rootMargin: '-42% 0px -42% 0px', threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return ref
}

export function ThemeZone({ theme, className, children }) {
  const ref = useThemeZone(theme)
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Backdrop                                                            */
/* ------------------------------------------------------------------ */

/**
 * Fixed, full-viewport gradient field behind the page. One layer per theme,
 * crossfaded by opacity (background-image itself cannot transition). The base
 * layer is opaque so it fully replaces the body's static crimson glow while
 * the landing page is mounted.
 */
export function ThemeBackdrop() {
  const active = useSiteTheme()

  // The static site gradient lives on BOTH html and body; body's copy paints
  // above negative-z-index fixed layers, so it would hide this backdrop
  // entirely. Suppress it while the theme field owns the page background.
  useEffect(() => {
    document.documentElement.classList.add('theme-field')
    return () => document.documentElement.classList.remove('theme-field')
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #0a0406 0%, #150609 52%, #0b0407 100%)' }}
      />
      {Object.entries(THEMES).map(([key, t]) => (
        <div
          key={key}
          className="absolute inset-0 transition-opacity duration-[1200ms] ease-out"
          style={{
            opacity: active === key ? 1 : 0,
            background:
              `radial-gradient(64% 52% at 50% 26%, rgba(${t.accent}, .20) 0%, rgba(${t.accent}, .07) 45%, transparent 74%), ` +
              `radial-gradient(40% 36% at 88% 82%, rgba(${t.accent}, .11), transparent 70%), ` +
              `radial-gradient(34% 30% at 6% 64%, rgba(${t.accent}, .08), transparent 70%)`,
          }}
        />
      ))}
    </div>
  )
}
