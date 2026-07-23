import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'

/* ------------------------------------------------------------------ */
/* Lenis smooth scroll (app-wide, smooths the real window scroll)       */
/* ------------------------------------------------------------------ */

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    })
    window.__lenis = lenis

    let raf
    const loop = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    // Hash links route through Lenis so anchors keep the eased motion.
    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href').slice(1)
      if (!id) {
        e.preventDefault()
        lenis.scrollTo(0)
        return
      }
      const el = document.getElementById(id)
      if (el) {
        e.preventDefault()
        lenis.scrollTo(el, { offset: -90 })
      }
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      cancelAnimationFrame(raf)
      lenis.destroy()
      delete window.__lenis
    }
  }, [])

  return null
}

/* ------------------------------------------------------------------ */
/* Scroll restoration + in-page hash targets                            */
/* ------------------------------------------------------------------ */

export function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // Let the new route paint before measuring the target.
      const id = hash.slice(1)
      const t = setTimeout(() => {
        const el = document.getElementById(id)
        if (el) {
          if (window.__lenis) window.__lenis.scrollTo(el, { offset: -90 })
          else el.scrollIntoView({ block: 'start' })
        }
      }, 120)
      return () => clearTimeout(t)
    }
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
    return undefined
  }, [pathname, hash])

  return null
}

/* ------------------------------------------------------------------ */
/* Scroll reveals                                                       */
/* ------------------------------------------------------------------ */

/**
 * Observes every `.reveal` on the page and flips `data-revealed`.
 * Re-scans on route change, and has a safety net that un-hides everything
 * if the observer never fires (a hidden page must never stay hidden).
 */
export function RevealObserver() {
  const { pathname } = useLocation()

  useEffect(() => {
    const nodes = () => Array.from(document.querySelectorAll('.reveal:not([data-revealed])'))

    const showAll = () => nodes().forEach((n) => n.setAttribute('data-revealed', 'true'))

    if (!('IntersectionObserver' in window)) {
      showAll()
      return undefined
    }

    let stagger = 0
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.style.setProperty('--reveal-delay', `${Math.min(stagger, 260)}ms`)
          entry.target.setAttribute('data-revealed', 'true')
          stagger += 60
          io.unobserve(entry.target)
        })
        // Reset the stagger between batches so later sections don't inherit a huge delay.
        window.clearTimeout(io.__resetTimer)
        io.__resetTimer = window.setTimeout(() => {
          stagger = 0
        }, 220)
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
    )

    // Attach after paint so lazily-mounted routes are in the DOM.
    const attach = () => nodes().forEach((n) => io.observe(n))
    const t1 = setTimeout(attach, 60)
    const t2 = setTimeout(attach, 400)
    // Safety net.
    const t3 = setTimeout(showAll, 2600)

    // Watch for `.reveal` elements added *after* the initial paint — cards
    // filtered in by a category chip, a "show more" toggle, etc. The route
    // never changes for those, so without this nothing would ever observe them
    // and they'd stay stuck at opacity:0 — making the filter look broken.
    const observeNew = (root) => {
      if (root.matches?.('.reveal:not([data-revealed])')) io.observe(root)
      root.querySelectorAll?.('.reveal:not([data-revealed])').forEach((n) => io.observe(n))
    }
    const mo = new MutationObserver((mutations) => {
      mutations.forEach((m) =>
        m.addedNodes.forEach((node) => {
          if (node.nodeType === 1) observeNew(node)
        })
      )
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      window.clearTimeout(io.__resetTimer)
      io.disconnect()
      mo.disconnect()
    }
  }, [pathname])

  return null
}
