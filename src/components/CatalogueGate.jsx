import { RotateCw } from 'lucide-react'
import { useCatalogue } from '@/context/CatalogueContext'

/**
 * Gates routed page content on the catalogue load — every page below can
 * assume `useCatalogue()` has data once it renders. Header/Footer sit
 * outside this gate (in App.jsx) so site chrome always renders, even while
 * the catalogue is loading or unreachable.
 */
function Splash() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-4 text-center">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-beam/20" />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-beam/30 bg-beam/10">
          <img src="/radium-logo.svg" alt="" className="h-6 w-6" aria-hidden />
        </span>
      </div>
      <div>
        <p className="t-eyebrow justify-center text-beam/70">Warming up the catalogue</p>
        <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
          First load can take a little while — please hold on a moment.
        </p>
      </div>
    </div>
  )
}

function ErrorPanel({ message, retry }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="t-h3 text-foreground">Catalogue temporarily unavailable</p>
      <p className="max-w-sm text-[13.5px] leading-relaxed text-muted-foreground">
        {message || 'We could not reach the Radium catalogue service. Please try again in a moment.'}
      </p>
      <button
        type="button"
        onClick={retry}
        className="mt-1 inline-flex items-center gap-2 rounded-full border border-beam/40 bg-beam/10 px-5 py-2.5 text-sm font-semibold text-beam transition-colors hover:bg-beam/20"
      >
        <RotateCw className="h-3.5 w-3.5" /> Retry
      </button>
    </div>
  )
}

export default function CatalogueGate({ children }) {
  const catalogue = useCatalogue()
  if (!catalogue) return children
  if (catalogue.status === 'loading' && !catalogue.hasData) return <Splash />
  if (catalogue.status === 'error' && !catalogue.hasData) {
    return <ErrorPanel message={catalogue.error} retry={catalogue.retry} />
  }
  return children
}
