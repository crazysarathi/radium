import { Navigate, Link, useParams } from 'react-router-dom'
import { ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react'
import ProductGallery from '@/components/ProductGallery'
import {
  PageHero, Breadcrumb, Section, SpecTable, Badge, Button, DraftNotice, SplitText,
} from '@/components/ui'
import { getRefurb, getGrade, refurbished, refurbProcess } from '@/data/refurbished'
import { getProduct } from '@/data/products'

export default function RefurbDetail() {
  const { id } = useParams()
  const item = getRefurb(id)
  if (!item) return <Navigate to="/certified-pre-owned" replace />

  const grade = getGrade(item.grade)
  const product = getProduct(item.family)
  const model = item.modelCode
    ? { code: item.modelCode, bays: parseInt(item.modelCode.slice(0, 2), 10), drivesInstalled: parseInt(item.modelCode.slice(4, 6), 10) }
    : undefined

  const alsoAvailable = refurbished.filter((r) => r.id !== item.id).slice(0, 4)

  const specs = [
    {
      group: 'Listing',
      rows: [
        ['SKU', item.sku],
        ['Condition grade', `${grade.label} — ${grade.short}`],
        ['Year of manufacture', String(item.year)],
        ['Power-on hours', item.powerOnHours.toLocaleString()],
        ['Units available', String(item.quantity)],
        ['Ships from', item.location],
      ],
    },
    {
      group: 'Configuration',
      rows: [
        ['Form factor', item.formFactor],
        ['As configured', item.config],
        ['Product family', product?.name ?? item.family],
        ['Indicative price', item.listPriceNote],
      ],
    },
    {
      group: 'Warranty',
      rows: [
        ['Coverage', `${item.warrantyMonths} months Radium Certified Pre-Owned`],
        ['Support path', 'Same escalation queue as new hardware'],
        ['Parts', 'Advance replacement'],
        ['Burn-in', '72-hour thermal and I/O soak, passed'],
      ],
    },
  ]

  return (
    <>
      <PageHero
        breadcrumb={
          <Breadcrumb
            trail={[
              { label: 'Home', to: '/' },
              { label: 'Certified Pre-Owned', to: '/certified-pre-owned' },
              { label: item.title },
            ]}
          />
        }
        eyebrow={`${item.sku} · ${grade.label}`}
        title={item.title}
        body={item.condition}
      >
        <div className="mt-7 flex flex-wrap items-center gap-2.5">
          <Badge tone="good">{item.quantity} in stock</Badge>
          <Badge tone="muted">{item.warrantyMonths}-month warranty</Badge>
          <Badge tone="muted">{item.powerOnHours.toLocaleString()} power-on hours</Badge>
          <Badge tone="muted">{item.location}</Badge>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button to="/contact" size="lg">Request pricing <ArrowRight className="h-4 w-4" /></Button>
          <Button to="/certified-pre-owned" variant="outline" size="lg">
            <ArrowLeft className="h-4 w-4" /> Back to stock
          </Button>
          {product && (
            <Button to={`/products/${product.slug}`} variant="ghost" size="lg">
              View {product.name} new
            </Button>
          )}
        </div>
      </PageHero>

      <Section tight>
        <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <div className="reveal glass overflow-hidden p-8">
            <div className="mb-5 flex items-center justify-between">
              <span className="t-eyebrow text-beam/70">Product views</span>
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg font-mono text-sm font-bold"
                style={{ background: `${grade.accent}1f`, color: grade.accent, border: `1px solid ${grade.accent}44` }}
              >
                {grade.key}
              </span>
            </div>
            <ProductGallery
              key={item.id}
              product={product}
              model={model}
              caption="Representative catalogue photography for the listed configuration. Photographs of the exact unit are supplied with the quotation."
            />
          </div>

          <div className="reveal glass p-8">
            <h2 className="t-h3 text-foreground">What is included</h2>
            <ul className="mt-5 space-y-3">
              {item.included.map((line) => (
                <li key={line} className="flex items-start gap-2.5 text-[13.5px] text-foreground/90">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-beam/70" />
                  {line}
                </li>
              ))}
            </ul>

            <div className="mt-7 rounded-xl border border-beam/20 bg-beam/[.06] p-5">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-beam" />
                <p className="text-sm font-bold text-foreground">{item.warrantyMonths}-month CPO warranty</p>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                Advance parts replacement and the same support escalation path as new Radium
                hardware. Extendable at the point of sale.
              </p>
            </div>

            <div className="mt-6 border-t border-white/[.06] pt-5">
              <p className="text-[11.5px] uppercase tracking-[.14em] text-muted-foreground/85">Indicative price</p>
              <p className="mt-1 text-lg font-bold text-foreground">{item.listPriceNote}</p>
              <p className="mt-1.5 text-[12.5px] text-muted-foreground">
                Final pricing depends on quantity, warranty term and delivery. Request a quote for a firm number.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section tight>
        <SplitText as="h2" gradient text="Listing detail" className="t-h2 reveal" />
        <div className="reveal glass mt-7 px-6 md:px-10">
          <SpecTable groups={specs} />
        </div>
        <div className="reveal mt-5">
          <DraftNotice>
            This listing is placeholder data from{' '}
            <span className="font-mono text-foreground/80">src/data/refurbished.js</span>.
          </DraftNotice>
        </div>
      </Section>

      <Section tight>
        <h2 className="t-h3 reveal text-foreground">Every unit clears these six stages</h2>
        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {refurbProcess.map((s) => (
            <li key={s.step} className="reveal glass flex items-start gap-3 p-4">
              <span className="font-mono text-[12px] font-bold text-beam/70">{s.step}</span>
              <span className="text-[13.5px] text-foreground/90">{s.title}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section tight>
        <h2 className="t-h3 reveal text-foreground">Also in stock</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {alsoAvailable.map((r) => (
            <Link key={r.id} to={`/certified-pre-owned/${r.id}`} className="reveal glass glass-hover group p-5">
              <p className="font-mono text-[11px] uppercase tracking-[.12em] text-muted-foreground/85">{r.sku}</p>
              <p className="mt-2 text-[14.5px] font-bold text-foreground group-hover:text-beam">{r.title}</p>
              <p className="mt-1.5 text-[12.5px] text-muted-foreground">
                Grade {r.grade} · {r.quantity} available
              </p>
            </Link>
          ))}
        </div>
      </Section>
    </>
  )
}
