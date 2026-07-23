import { Navigate, Link, useParams } from 'react-router-dom'
import { ArrowRight, ArrowLeft, FileText } from 'lucide-react'
import ProductGallery from '@/components/ProductGallery'
import { PageHero, Breadcrumb, Section, SpecTable, Badge, Button, DraftNotice, SplitText } from '@/components/ui'
import { getModel, getProduct, jupiterModels, commonSpecs } from '@/data/products'
import { formatCapacity } from '@/lib/utils'

export default function ModelDetail() {
  const { code } = useParams()
  const model = getModel(code)
  if (!model) return <Navigate to="/products/jupiter" replace />

  const family = getProduct('jupiter')
  const maxRaw = model.bays * model.driveCapacityTb
  const fillPct = Math.round((model.drivesInstalled / model.bays) * 100)

  const siblings = jupiterModels.filter((m) => m.bays === model.bays && m.code !== model.code)

  const configSpecs = [
    {
      group: 'Configuration',
      rows: [
        ['Model number', model.name],
        ['Drive bays', `${model.bays} × 3.5" hot-swap`],
        ['Drive capacity', `${model.driveCapacityTb} TB per drive`],
        ['Drives installed', `${model.drivesInstalled}`],
        ['Free bays', `${model.baysFree}`],
        ['Chassis height', model.rackUnits],
      ],
    },
    {
      group: 'Capacity',
      rows: [
        ['Raw as shipped', formatCapacity(model.rawCapacityTb)],
        ['Raw when full', formatCapacity(maxRaw)],
        ['Expansion headroom', formatCapacity(model.baysFree * model.driveCapacityTb)],
        ['Bay utilisation', `${fillPct}%`],
      ],
    },
    ...family.specs.filter((g) => g.group !== 'Storage'),
    ...commonSpecs(family),
  ]

  return (
    <>
      <PageHero
        breadcrumb={
          <Breadcrumb
            trail={[
              { label: 'Home', to: '/' },
              { label: 'Products', to: '/products' },
              { label: 'Jupiter', to: '/products/jupiter' },
              { label: model.name },
            ]}
          />
        }
        eyebrow="Storage Server · SAN / NAS"
        title={model.name}
        body={`A ${model.rackUnits} Jupiter storage server with ${model.bays} bays, shipping with ${model.drivesInstalled} × ${model.driveCapacityTb} TB drives installed — ${formatCapacity(model.rawCapacityTb)} raw, with ${model.baysFree} bays left for expansion.`}
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button to="/contact" size="lg">
            Request a quote <ArrowRight className="h-4 w-4" />
          </Button>
          <Button to="/products/jupiter#models" variant="outline" size="lg">
            <ArrowLeft className="h-4 w-4" /> All Jupiter models
          </Button>
        </div>
      </PageHero>

      <Section tight>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
          {/* Artwork */}
          <div className="reveal glass overflow-hidden p-8">
            <div className="mb-5 flex items-center justify-between">
              <span className="t-eyebrow text-beam/70">Product views</span>
              <Badge>{model.rackUnits} rackmount</Badge>
            </div>
            <ProductGallery
              key={model.code}
              product={family}
              model={model}
              caption={`Catalogue photography of the ${family.name} platform. This model ships as a ${model.bays}-bay chassis with ${model.drivesInstalled} drives installed — see the breakdown alongside.`}
            />
          </div>

          {/* Decoded number */}
          <div className="reveal glass p-8">
            <span className="t-eyebrow text-beam/70">Model number breakdown</span>
            <div className="mt-5 flex gap-1.5 font-mono text-[40px] font-bold leading-none tracking-[.1em]">
              <span className="text-[#ff4d5e]">{model.code.slice(0, 2)}</span>
              <span className="text-[#ff97a1]">{model.code.slice(2, 4)}</span>
              <span className="text-[#ffd6da]">{model.code.slice(4, 6)}</span>
            </div>

            <ul className="mt-7 space-y-3.5">
              {[
                ['#ff4d5e', 'Bays', model.bays],
                ['#ff97a1', 'Drive capacity', `${model.driveCapacityTb} TB`],
                ['#ffd6da', 'Drives installed', model.drivesInstalled],
              ].map(([color, label, value]) => (
                <li key={label} className="flex items-center justify-between gap-4 border-b border-white/[.06] pb-3.5">
                  <span className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ background: color }} />
                    {label}
                  </span>
                  <span className="font-mono text-sm font-semibold text-foreground">{value}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7">
              <div className="flex items-end justify-between">
                <p className="text-[11.5px] uppercase tracking-[.14em] text-muted-foreground">Raw capacity</p>
                <p className="text-[11.5px] text-muted-foreground">{fillPct}% of bays used</p>
              </div>
              <p className="mt-1 text-4xl font-extrabold tracking-tight text-grad">{formatCapacity(model.rawCapacityTb)}</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[.07]">
                <div className="h-full rounded-full bg-accent-grad shadow-glow" style={{ width: `${fillPct}%` }} />
              </div>
              <p className="mt-3 text-[13px] text-muted-foreground">
                Fill the remaining {model.baysFree} bays to reach{' '}
                <span className="font-semibold text-beam">{formatCapacity(maxRaw)}</span> raw — no chassis
                change, no migration. Beyond that, attach a{' '}
                <Link to="/products/io" className="text-beam hover:underline">Radium Io</Link> pod.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section tight>
        <SplitText as="h2" gradient text="Specification" className="t-h2 reveal" />
        <div className="reveal glass mt-7 px-6 md:px-10">
          <SpecTable groups={configSpecs} />
        </div>
        <div className="reveal mt-5">
          <DraftNotice>
            Chassis-level values are inherited from the Jupiter family record. Per-SKU
            overrides can be added in <span className="font-mono text-foreground/80">src/data/products.js</span>.
          </DraftNotice>
        </div>
      </Section>

      {siblings.length > 0 && (
        <Section tight>
          <h2 className="t-h3 reveal text-foreground">Other {model.bays}-bay configurations</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {siblings.map((s) => (
              <Link key={s.code} to={`/products/jupiter/${s.code}`} className="reveal glass glass-hover group p-5">
                <p className="font-mono text-[15px] font-bold text-foreground group-hover:text-beam">{s.code}</p>
                <p className="mt-1.5 text-[12.5px] text-muted-foreground">
                  {s.driveCapacityTb} TB × {s.drivesInstalled}
                </p>
                <p className="mt-2 text-[13px] font-semibold text-beam">{formatCapacity(s.rawCapacityTb)}</p>
              </Link>
            ))}
          </div>
        </Section>
      )}

      <Section tight>
        <div className="reveal glass flex flex-col gap-5 p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="t-h3 text-foreground">Need this sized against your retention policy?</h2>
            <p className="mt-2 max-w-xl text-[13.5px] text-muted-foreground">
              Send study volume, modality mix and retention years — we come back with the
              model number and the year it runs out of room.
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <Button to="/contact" size="lg">Request a quote</Button>
            <Button to="/resources" variant="outline" size="lg">
              <FileText className="h-4 w-4" /> Datasheet
            </Button>
          </div>
        </div>
      </Section>
    </>
  )
}
