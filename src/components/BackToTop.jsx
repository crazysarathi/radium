import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Fixed back-to-top control, bottom-right. Fades in once the page is scrolled a
 * screenful or so, and rides the app-wide Lenis instance so the return trip
 * keeps the same eased motion as every other scroll (falls back to native
 * smooth scroll when Lenis is off — reduced-motion / no-JS-smoothing).
 */
export default function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0)
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={toTop}
          aria-label="Back to top"
          data-cursor
          initial={{ opacity: 0, scale: 0.6, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 14 }}
          transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
          whileHover={{ y: -2 }}
          className="group fixed bottom-6 right-6 z-[60] flex h-12 w-12 items-center justify-center rounded-full border border-beam/30 bg-[#1a0709]/80 text-beam shadow-[0_0_26px_-4px_rgba(255,77,94,.55)] backdrop-blur-md transition-colors hover:border-beam/60 hover:bg-beam/15 hover:text-foreground"
        >
          <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
