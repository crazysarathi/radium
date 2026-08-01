import { useState } from 'react'
import { Navigate, Link, useParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ShoppingCart } from 'lucide-react'
import ProductGallery, { ProductImage } from '@/components/ProductGallery'
import {
  PageHero, Breadcrumb, Section, SectionHead, SpecTable, Badge, Button, DraftNotice, SplitText,
} from '@/components/ui'
import { getFullSpecs } from '@/lib/catalogue'
import { useCatalogue } from '@/context/CatalogueContext'
import { useEnquiry } from '@/components/enquiry/EnquiryContext'
import { formatCapacity } from '@/lib/utils'

/**
 * AIC-style model line-up, one grid for every family: variants with a
 * decodable SKU code render as decoded capacity cards linking to their detail
 * page; named models render as photo cards with dash-bullet specs and a quote
 * action — filterable by rack unit either way.
 */
function VariantModels({ product }) {
  const { variantsFor, rackUnitsFor } = useCatalogue()
  // Variants key off the product's immutable id, not its (renameable) slug.
  const models = variantsFor(product.id)
  const units = rackUnitsFor(product.id)
  const [ru, setRu] = useState('all')
  if (models.length === 0) return null

  const shown = ru === 'all' ? models : models.filter((m) => m.rackUnits === ru)

  return (
    <Section id="models" tight>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <SectionHead
          eyebrow="Model line-up"
          title={`${product.series} models`}
          body={`Every ${product.name.toLowerCase()} model in the current catalogue. Photography and headline specifications shown per model — request a quote for the full datasheet.`}
        />
        {units.length > 1 && (
          <div className="reveal flex flex-wrap gap-2">
            {['all', ...units].map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setRu(u)}
                className={
                  'rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-all ' +
                  (ru === u
                    ? 'border-beam/60 bg-beam/15 text-beam'
                    : 'border-white/10 text-muted-foreground hover:border-beam/30 hover:text-foreground')
                }
              >
                {u === 'all' ? `All (${models.length})` : u}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((m) =>
          m.code ? (
            <Link
              key={m.id}
              id={m.id}
              to={`/products/${product.slug}/${m.code}`}
              className="reveal glass glass-hover group flex h-full flex-col p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-mono text-[17px] font-bold text-foreground transition-colors group-hover:text-beam">
                  {m.code}
                </h3>
                <Badge tone="muted">{m.rackUnits}</Badge>
              </div>
              <p className="mt-1.5 text-[12.5px] text-muted-foreground">{m.name}</p>
              {m.bays != null && (
                <>
                  <p className="mt-4 flex-1 text-[13px] leading-snug text-muted-foreground">
                    {m.bays} bays · {m.driveCapacityTb} TB drives · {m.drivesInstalled} installed
                  </p>
                  <p className="mt-3 text-[14px] font-semibold text-beam">
                    {formatCapacity(m.rawCapacityTb)} raw
                  </p>
                </>
              )}
              <div className="mt-5 border-t border-white/[.06] pt-4 text-[12.5px] font-semibold text-beam">
                View model <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
              </div>
            </Link>
          ) : (
            <div
              key={m.id}
              id={m.id}
              className="reveal group flex h-full flex-col overflow-hidden rounded-glass border border-white/[.08] bg-[rgba(30,12,14,.55)] backdrop-blur-[12px] transition-[border-color,box-shadow] duration-300 hover:border-beam/40 hover:shadow-[0_0_38px_-8px_rgba(255,77,94,.35)]"
            >
              <div className="border-b border-white/[.06] bg-white p-5">
                <img
                  src={m.img}
                  alt={`${m.name} — front view`}
                  loading="lazy"
                  className="aspect-[360/236] w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-mono text-[17px] font-bold text-foreground transition-colors group-hover:text-beam">
                    {m.name}
                  </h3>
                  <Badge tone="muted">{m.rackUnits}</Badge>
                </div>
                <ul className="mt-4 flex-1 space-y-1.5">
                  {m.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-[13px] leading-snug text-muted-foreground">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-beam/70" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 border-t border-white/[.06] pt-4">
                  <Link
                    to="/contact"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-beam/40 bg-beam/10 px-3 py-2 text-[12.5px] font-semibold text-beam transition-colors hover:bg-beam/20"
                  >
                    Request a Quote
                  </Link>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {shown.length === 0 && (
        <div className="glass mt-6 p-12 text-center text-muted-foreground">No models in that size.</div>
      )}
    </Section>
  )
}

export default function ProductFamily() {
  const { slug } = useParams()
  const enquiry = useEnquiry()
  const { getProduct, products } = useCatalogue()
  const product = getProduct(slug)
  if (!product) return <Navigate to="/products" replace />

  const roadmap = product.status === 'roadmap'
  const fullSpecs = getFullSpecs(product)
  const related = products.filter((p) => p.slug !== product.slug && p.status === 'available').slice(0, 3)

  return (
    <>
      <PageHero
        breadcrumb={
          <Breadcrumb
            trail={[{ label: 'Home', to: '/' }, { label: 'Products', to: '/products' }, { label: product.name }]}
          />
        }
        eyebrow={product.tagline}
        title={product.name}
        body={product.summary}
      >
        <div className="mt-7 flex flex-wrap items-center gap-2.5">
          <Badge tone={roadmap ? 'warn' : 'good'}>{roadmap ? 'Roadmap' : 'Available'}</Badge>
          <Badge tone="muted">{product.formFactor}</Badge>
          {product.note && <Badge tone="muted">{product.note}</Badge>}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button to="/contact" size="lg">
            Request a quote <ArrowRight className="h-4 w-4" />
          </Button>
          {!roadmap && (
            <Button
              as="button"
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                enquiry?.add({ id: `product:${product.slug}`, name: product.name, meta: product.tagline, family: product.slug })
                enquiry?.openDrawer()
              }}
            >
              <ShoppingCart className="h-4 w-4" /> Add to enquiry
            </Button>
          )}
          {product.hasModels && (
            <Button href="#models" variant="outline" size="lg">
              View model numbers
            </Button>
          )}
        </div>
      </PageHero>

      {/* Artwork + highlights */}
      <Section tight>
        {roadmap ? (
          <div className="reveal glass p-10 text-center md:p-16">
            <h2 className="t-h3 text-foreground">Specification not yet published</h2>
            <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-muted-foreground">
              {product.name} is reserved in the Radium naming scheme. If you have a
              requirement the current line does not cover, tell us — roadmap products
              get built against real deployments.
            </p>
            <Button to="/contact" className="mt-7">
              Talk to engineering <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
            <div className="reveal glass overflow-hidden p-8">
              <ProductGallery
                key={product.slug}
                product={product}
                caption="Catalogue photography of the platform behind this family. Bay layout shown is representative of a standard configuration."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {product.highlights.map((h) => (
                <div key={h.title} className="reveal glass glass-hover p-5">
                  <h3 className="text-[15px] font-bold text-foreground">{h.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{h.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* Variant model line-up (AIC-style catalogue grid) */}
      <VariantModels product={product} />

      {/* Specs */}
      {fullSpecs.length > 0 && (
        <Section id="specs" tight>
          <SectionHead eyebrow="Specifications" title="Technical specification" />
          <div className="reveal glass mt-9 px-6 md:px-10">
            <SpecTable groups={fullSpecs} />
          </div>
          <div className="reveal mt-5">
            <DraftNotice>
              Specification values are indicative pending the approved datasheet. Update
              them via the admin console.
            </DraftNotice>
          </div>
        </Section>
      )}

      {/* Applications */}
      {product.applications.length > 0 && (
        <Section tight>
          <div className="glass grid gap-10 p-8 md:grid-cols-[.8fr_1.2fr] md:p-12">
            <div className="reveal">
              <SplitText as="h2" gradient text="Key applications" className="t-h3" />
              <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
                Where {product.name} sits in a Radium imaging stack.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {product.applications.map((a) => (
                <li key={a} className="reveal flex items-start gap-2.5 rounded-xl border border-white/[.07] bg-[#1a0709]/40 p-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-beam/70" />
                  <span className="text-[13.5px] text-foreground/90">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {/* Related products */}
      <Section tight>
        <h3 className="t-eyebrow reveal mb-4 text-beam/70">Related products</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {related.map((p) => (
            <Link key={p.slug} to={`/products/${p.slug}`} className="reveal glass glass-hover group overflow-hidden">
              <ProductImage product={p} className="aspect-[360/236] w-full" />
              <div className="p-5 pt-4">
                <p className="text-[15px] font-bold text-foreground group-hover:text-beam">{p.name}</p>
                <p className="mt-1.5 text-[12.5px] text-muted-foreground">{p.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  )
}
