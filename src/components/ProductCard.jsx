import { Link } from 'react-router-dom'
import { ArrowRight, GitCompare, Check } from 'lucide-react'
import { ProductImage } from './ProductGallery'
import { Tilt } from './ui'
import { useCompare } from './compare/CompareContext'
import { cardBullets } from '@/data/products'
import { cn } from '@/lib/utils'

/**
 * AIC-style product card: a clean image panel over model name, dash-bullet spec
 * highlights and Request-a-Quote / Compare actions — on the dark Radium brand.
 * The image panel is adaptive (dark render now, light studio panel once a real
 * photo exists), courtesy of ProductImage.
 */
export default function ProductCard({ product, className }) {
  const roadmap = product.status === 'roadmap'
  const bullets = cardBullets(product)
  const compare = useCompare()
  const selected = compare?.has(product.slug)

  return (
    <Tilt className={cn('reveal h-full', roadmap && 'opacity-70', className)} max={5}>
      <div className="group flex h-full flex-col overflow-hidden rounded-glass border border-white/[.08] bg-[rgba(30,12,14,.55)] backdrop-blur-[12px] transition-[border-color,box-shadow] duration-300 hover:border-beam/40 hover:shadow-[0_0_38px_-8px_rgba(255,77,94,.35)]">
        {/* Image panel */}
        <Link to={`/products/${product.slug}`} className="block border-b border-white/[.06] bg-[#160607]/50 p-5">
          {roadmap ? (
            <div className="flex aspect-[360/236] items-center justify-center">
              <span className="rounded-full border border-dashed border-white/15 px-4 py-2 text-[11px] uppercase tracking-[.2em] text-muted-foreground">
                Specification pending
              </span>
            </div>
          ) : (
            <div className="transition-transform duration-500 group-hover:scale-[1.03]">
              <ProductImage product={product} className="aspect-[360/236] w-full" />
            </div>
          )}
        </Link>

        {/* Body */}
        <div className="flex flex-1 flex-col p-6">
          <Link to={`/products/${product.slug}`} className="flex items-start justify-between gap-3">
            <h3 className="t-h3 text-foreground transition-colors group-hover:text-beam">{product.name}</h3>
            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-beam/50 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-beam" />
          </Link>
          <p className="mt-1.5 text-sm font-medium text-beam/85">{product.tagline}</p>

          {roadmap ? (
            <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-muted-foreground">
              Reserved in the Radium naming scheme.
            </p>
          ) : (
            <ul className="mt-4 flex-1 space-y-1.5">
              {bullets.map((b) => (
                <li key={b} className="flex gap-2 text-[13px] leading-snug text-muted-foreground">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-beam/70" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}

          {!roadmap && (
            <div className="mt-5 flex items-center gap-2 border-t border-white/[.06] pt-4">
              <Link
                to="/contact"
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-beam/40 bg-beam/10 px-3 py-2 text-[12.5px] font-semibold text-beam transition-colors hover:bg-beam/20"
              >
                Request a Quote
              </Link>
              {compare && (
                <button
                  type="button"
                  onClick={() => compare.toggle(product.slug)}
                  aria-pressed={selected}
                  className={cn(
                    'inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[12.5px] font-semibold transition-colors',
                    selected
                      ? 'border-beam/60 bg-beam/20 text-beam'
                      : 'border-white/[.12] text-muted-foreground hover:border-beam/40 hover:text-foreground'
                  )}
                >
                  {selected ? <Check className="h-3.5 w-3.5" /> : <GitCompare className="h-3.5 w-3.5" />}
                  {selected ? 'Added' : 'Compare'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </Tilt>
  )
}
