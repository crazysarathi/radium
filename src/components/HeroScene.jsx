import { Suspense, lazy, useEffect, useState } from 'react'

// three.js is heavy — keep it out of the entry chunk and mount after first paint.
const Hero3D = lazy(() => import('./Hero3D'))

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
  } catch {
    return false
  }
}

/**
 * Renders the 3D data-core once the browser is idle and capable. When WebGL is
 * missing or the user prefers reduced motion, the caller's fallback stays put,
 * so the hero never depends on the canvas to look finished.
 */
export default function HeroScene({ fallback = null }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !hasWebGL()) return undefined

    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200))
    const cancel = window.cancelIdleCallback || clearTimeout
    const handle = idle(() => setReady(true))
    return () => cancel(handle)
  }, [])

  if (!ready) return fallback

  return (
    <Suspense fallback={fallback}>
      <Hero3D />
    </Suspense>
  )
}
