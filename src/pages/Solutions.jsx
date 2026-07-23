import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { PageHero, Breadcrumb, Section, Button, Badge, SplitText } from '@/components/ui'
import { ProductImage } from '@/components/ProductGallery'
import { solutions } from '@/data/site'
import { getProduct } from '@/data/products'

/** First token of a stack line's product name, e.g. "Neptune / Mars" → "neptune". */
const productSlug = (name) => name.trim().toLowerCase().split(' / ')[0]

export default function Solutions() {
  return (
    <>
      <PageHero
        breadcrumb={<Breadcrumb trail={[{ label: 'Home', to: '/' }, { label: 'Solutions' }]} />}
        eyebrow="Solutions"
        title="Sized for the workload, not the line item"
        body="Six deployment patterns Radium hardware is specified against. Each one names the products that make up the stack — and shows the hardware that ships in it."
      />

      <Section tight>
        <div className="space-y-12 md:space-y-16">
          {solutions.map((s, i) => {
            const primary = getProduct(productSlug(s.stack[0].split(' — ')[0]))

            return (
              <article
                key={s.slug}
                id={s.slug}
                className="reveal scroll-mt-28 grid items-center gap-10 md:grid-cols-2 lg:gap-16"
              >
                {/* Copy — odd rows keep it left, even rows swap for rhythm */}
                <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                  <div className="flex items-center gap-3">
                    <Badge tone="muted">{String(i + 1).padStart(2, '0')}</Badge>
                    <span className="t-eyebrow text-beam/60">Deployment pattern</span>
                  </div>
                  <SplitText as="h2" gradient text={s.title} className="t-h2 mt-5" />
                  <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground">{s.blurb}</p>

                  <div className="mt-7 space-y-1.5">
                    <p className="t-eyebrow text-beam/70">Hardware stack</p>
                    {s.stack.map((line) => {
                      const [name, role] = line.split(' — ')
                      return (
                        <Link
                          key={line}
                          to={`/products/${productSlug(name)}`}
                          className="group flex items-baseline gap-2.5 rounded-lg py-1.5 text-[14px] transition-colors"
                        >
                          <span className="h-1.5 w-1.5 shrink-0 translate-y-1.5 rounded-full bg-beam/70 transition-transform group-hover:scale-150" />
                          <span className="font-semibold text-foreground transition-colors group-hover:text-beam">{name}</span>
                          {role && <span className="text-muted-foreground"> — {role}</span>}
                          <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 self-center text-beam/0 transition-colors group-hover:text-beam/70" />
                        </Link>
                      )
                    })}
                  </div>

                  <Button to="/contact" variant="outline" size="sm" className="mt-8">
                    Discuss this deployment <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Product projection — the hardware image, not an icon */}
                <div className={i % 2 === 1 ? 'md:order-1' : ''}>
                  <div className="relative">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 -z-10 rounded-full opacity-70 blur-[70px]"
                      style={{ background: 'radial-gradient(circle at 50% 45%, rgba(255,77,94,.22), transparent 70%)' }}
                    />
                    <ProductImage product={primary} className="aspect-[360/236] w-full" />
                    <p className="mt-2 text-center text-[11.5px] uppercase tracking-[.16em] text-muted-foreground/70">
                      {primary?.name ?? 'Radium hardware'} — {s.stack.length} products in this stack
                    </p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </Section>
    </>
  )
}
