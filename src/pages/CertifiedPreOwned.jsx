import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Package, Clock } from 'lucide-react'
import { ProductImage } from '@/components/ProductGallery'
import {
  PageHero, Breadcrumb, Section, SectionHead, Badge, Button, DraftNotice, SplitText,
} from '@/components/ui'
import { refurbished, conditionGrades, refurbProcess, getGrade } from '@/data/refurbished'
import { getProduct } from '@/data/products'

const SORTS = [
  { key: 'grade', label: 'Condition' },
  { key: 'newest', label: 'Newest' },
  { key: 'hours', label: 'Lowest hours' },
  { key: 'stock', label: 'Most in stock' },
]

function StockCard({ item }) {
  const product = getProduct(item.family)
  const grade = getGrade(item.grade)

  return (
    <Link to={`/certified-pre-owned/${item.id}`} className="reveal glass glass-hover group flex flex-col overflow-hidden">
      <div className="relative border-b border-white/[.06] bg-[#1a0709]/40 px-6 pt-6 pb-3">
        <span
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg font-mono text-[13px] font-bold"
          style={{ background: `${grade.accent}1f`, color: grade.accent, border: `1px solid ${grade.accent}44` }}
        >
          {grade.key}
        </span>
        <div className="transition-transform duration-500 group-hover:scale-[1.04]">
          <ProductImage product={product} className="aspect-[360/236] w-full" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono text-[11px] uppercase tracking-[.14em] text-muted-foreground/85">{item.sku}</p>
        <h3 className="t-h3 mt-2 text-foreground transition-colors group-hover:text-beam">{item.title}</h3>
        <p className="mt-3 flex-1 text-[13px] leading-relaxed text-muted-foreground">{item.config}</p>

        <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-white/[.06] pt-4 text-[12px]">
          <div>
            <dt className="text-muted-foreground/85">Year</dt>
            <dd className="mt-0.5 font-semibold tabular-nums text-foreground">{item.year}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground/85">Hours</dt>
            <dd className="mt-0.5 font-semibold tabular-nums text-foreground">{item.powerOnHours.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground/85">In stock</dt>
            <dd className="mt-0.5 font-semibold tabular-nums text-beam">{item.quantity}</dd>
          </div>
        </dl>

        <div className="mt-4 flex items-center justify-between gap-3">
          <Badge tone="good">{item.warrantyMonths}-mo warranty</Badge>
          <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-beam">
            Details <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function CertifiedPreOwned() {
  const [grade, setGrade] = useState('all')
  const [family, setFamily] = useState('all')
  const [sort, setSort] = useState('grade')

  const families = useMemo(
    () => Array.from(new Set(refurbished.map((r) => r.family))),
    []
  )

  const shown = useMemo(() => {
    const list = refurbished.filter(
      (r) => (grade === 'all' || r.grade === grade) && (family === 'all' || r.family === family)
    )
    const sorted = [...list]
    if (sort === 'grade') sorted.sort((a, b) => a.grade.localeCompare(b.grade))
    if (sort === 'newest') sorted.sort((a, b) => b.year - a.year)
    if (sort === 'hours') sorted.sort((a, b) => a.powerOnHours - b.powerOnHours)
    if (sort === 'stock') sorted.sort((a, b) => b.quantity - a.quantity)
    return sorted
  }, [grade, family, sort])

  const totalUnits = refurbished.reduce((n, r) => n + r.quantity, 0)

  return (
    <>
      <PageHero
        breadcrumb={<Breadcrumb trail={[{ label: 'Home', to: '/' }, { label: 'Certified Pre-Owned' }]} />}
        eyebrow="Certified Pre-Owned"
        title="Used Radium hardware, rebuilt and warrantied"
        body="Ex-demo units, cancelled orders and decommissioned systems taken back through a six-stage refurbishment. Certified data destruction, new consumables, current firmware, 72-hour burn-in — and the same support path as new hardware."
      >
        <div className="mt-8 flex flex-wrap items-center gap-6">
          {[
            { icon: Package, label: `${totalUnits} units in stock` },
            { icon: ShieldCheck, label: 'Up to 36-month warranty' },
            { icon: Clock, label: '72-hour burn-in on every unit' },
          ].map((s) => (
            <span key={s.label} className="inline-flex items-center gap-2 text-[13px] text-muted-foreground">
              <s.icon className="h-4 w-4 text-beam/70" />
              {s.label}
            </span>
          ))}
        </div>
      </PageHero>

      {/* Grades */}
      <Section tight>
        <SectionHead
          eyebrow="Condition grading"
          title="Cosmetic grade, never functional grade"
          body="Every unit — A, B or C — clears the same electrical testing and the same 72-hour burn-in. The grade describes how it looks, not how it works."
        />
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {conditionGrades.map((g) => (
            <div key={g.key} className="reveal glass glass-hover p-6">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl font-mono text-lg font-bold"
                style={{ background: `${g.accent}1f`, color: g.accent, border: `1px solid ${g.accent}44` }}
              >
                {g.key}
              </span>
              <h3 className="t-h3 mt-4 text-foreground">{g.label}</h3>
              <p className="mt-1 text-[12px] uppercase tracking-[.14em] text-muted-foreground/85">{g.short}</p>
              <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{g.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Inventory */}
      <Section id="stock" tight>
        <SectionHead eyebrow="Available stock" title="Current inventory" />

        <div className="reveal glass sticky top-[84px] z-30 mt-8 flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[11px] uppercase tracking-[.14em] text-muted-foreground/85">Grade</span>
            {['all', ...conditionGrades.map((g) => g.key)].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGrade(g)}
                className={
                  'rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-all ' +
                  (grade === g
                    ? 'border-beam/60 bg-beam/15 text-beam'
                    : 'border-white/10 text-muted-foreground hover:border-beam/30 hover:text-foreground')
                }
              >
                {g === 'all' ? 'All' : `Grade ${g}`}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-[12.5px] text-muted-foreground">
              Family
              <select
                value={family}
                onChange={(e) => setFamily(e.target.value)}
                className="rounded-lg border border-white/10 bg-[#1a0709] px-2.5 py-1.5 text-[13px] text-foreground outline-none focus:border-beam/60"
              >
                <option value="all">All</option>
                {families.map((f) => (
                  <option key={f} value={f}>{getProduct(f)?.name ?? f}</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-[12.5px] text-muted-foreground">
              Sort
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-lg border border-white/10 bg-[#1a0709] px-2.5 py-1.5 text-[13px] text-foreground outline-none focus:border-beam/60"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <p className="reveal mt-6 text-[13px] text-muted-foreground">
          <span className="text-foreground">{shown.length}</span> listings ·{' '}
          {shown.reduce((n, r) => n + r.quantity, 0)} units
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((item) => (
            <StockCard key={item.id} item={item} />
          ))}
        </div>

        {shown.length === 0 && (
          <div className="glass mt-6 p-12 text-center text-muted-foreground">
            Nothing in stock matches that filter. <Link to="/contact" className="text-beam hover:underline">Tell us what you need</Link> and we will source it.
          </div>
        )}

        <div className="reveal mt-8">
          <DraftNotice>
            Inventory is placeholder data. Point{' '}
            <span className="font-mono text-foreground/80">src/data/refurbished.js</span> at your live stock feed before launch.
          </DraftNotice>
        </div>
      </Section>

      {/* Process */}
      <Section id="process" tight>
        <SectionHead
          eyebrow="Refurbishment process"
          title="Six stages between decommission and resale"
          body="Nothing is listed until it has been through all six. The audit trail travels with the asset."
        />
        <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {refurbProcess.map((s) => (
            <li key={s.step} className="reveal glass glass-hover p-6">
              <span className="font-mono text-[13px] font-bold text-beam/70">{s.step}</span>
              <h3 className="t-h3 mt-3 text-foreground">{s.title}</h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section tight>
        <div className="reveal glass flex flex-col gap-5 p-8 text-center md:p-14">
          <SplitText as="h2" gradient text="Have Radium hardware to decommission?" className="t-h2 mx-auto max-w-2xl" />
          <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            We buy back Radium systems, issue a data destruction certificate per unit, and
            credit the value against your next configuration.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button to="/contact" size="lg">Start a trade-in <ArrowRight className="h-4 w-4" /></Button>
            <Button to="/products" variant="outline" size="lg">Browse new hardware</Button>
          </div>
        </div>
      </Section>
    </>
  )
}
