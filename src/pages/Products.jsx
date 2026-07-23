import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Search } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { PageHero, Breadcrumb, Section, Badge, Button } from '@/components/ui'
import { products, categories, jupiterModels } from '@/data/products'
import { formatCapacity } from '@/lib/utils'

export default function Products() {
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const [showRoadmap, setShowRoadmap] = useState(true)

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return products.filter((p) => {
      if (cat !== 'all' && p.category !== cat) return false
      if (!showRoadmap && p.status === 'roadmap') return false
      if (!needle) return true
      return [p.name, p.tagline, p.note, p.summary, p.formFactor]
        .filter(Boolean)
        .some((s) => s.toLowerCase().includes(needle))
    })
  }, [cat, q, showRoadmap])

  return (
    <>
      <PageHero
        breadcrumb={<Breadcrumb trail={[{ label: 'Home', to: '/' }, { label: 'Products' }]} />}
        eyebrow="Product line"
        title="Radium® Computers"
        body="Twelve product families covering compute, storage, chassis, workstations and the medical edge. Filter the line, or jump straight to a family."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button to="/products/jupiter#models" size="md">
            Storage server model numbers <ArrowRight className="h-4 w-4" />
          </Button>
          <Button to="/certified-pre-owned" variant="outline" size="md">
            Certified Pre-Owned stock
          </Button>
        </div>
      </PageHero>

      <Section tight>
        {/* Filter bar */}
        <div className="reveal glass sticky top-[84px] z-30 flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {[{ key: 'all', label: 'All products' }, ...categories].map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setCat(c.key)}
                className={
                  'rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-all ' +
                  (cat === c.key
                    ? 'border-beam/60 bg-beam/15 text-beam'
                    : 'border-white/10 text-muted-foreground hover:border-beam/30 hover:text-foreground')
                }
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-[12.5px] text-muted-foreground">
              <input
                type="checkbox"
                checked={showRoadmap}
                onChange={(e) => setShowRoadmap(e.target.checked)}
                className="h-3.5 w-3.5 accent-[#ff4d5e]"
              />
              Show roadmap
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search the line…"
                aria-label="Search products"
                className="w-full rounded-full border border-white/10 bg-[#1a0709]/60 py-2 pl-9 pr-4 text-[13px] outline-none transition-colors focus:border-beam/60 md:w-56"
              />
            </div>
          </div>
        </div>

        <p className="reveal mt-6 text-[13px] text-muted-foreground">
          Showing <span className="text-foreground">{shown.length}</span> of {products.length} families
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>

        {shown.length === 0 && (
          <div className="glass mt-6 p-12 text-center text-muted-foreground">
            No products match that filter.
          </div>
        )}
      </Section>

      {/* Storage server model index */}
      <Section id="model-index" tight>
        <div className="reveal glass overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[.07] p-6">
            <div>
              <h2 className="t-h3 text-foreground">Storage Server (SAN / NAS) model numbers</h2>
              <p className="mt-1.5 text-[13px] text-muted-foreground">
                First two digits — bays. Second two — drive capacity. Last two — drives installed.
              </p>
            </div>
            <Badge>{jupiterModels.length} SKUs</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/[.07] text-[11px] uppercase tracking-[.14em] text-muted-foreground/85">
                  <th scope="col" className="px-6 py-3 font-semibold">Model</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Bays</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Drive size</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Installed</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Raw capacity</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Chassis</th>
                  <th scope="col" className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[.05]">
                {jupiterModels.map((m) => (
                  <tr key={m.code} className="transition-colors hover:bg-beam/[.06]">
                    <th scope="row" className="px-6 py-3.5 font-mono text-[13.5px] font-semibold text-foreground">
                      {m.name}
                    </th>
                    <td className="px-6 py-3.5 tabular-nums text-muted-foreground">{m.bays}</td>
                    <td className="px-6 py-3.5 tabular-nums text-muted-foreground">{m.driveCapacityTb} TB</td>
                    <td className="px-6 py-3.5 tabular-nums text-muted-foreground">
                      {m.drivesInstalled}
                      {m.baysFree > 0 && <span className="ml-1.5 text-[11px] text-beam/60">+{m.baysFree} free</span>}
                    </td>
                    <td className="px-6 py-3.5 font-semibold tabular-nums text-beam">{formatCapacity(m.rawCapacityTb)}</td>
                    <td className="px-6 py-3.5 text-muted-foreground">{m.rackUnits}</td>
                    <td className="px-6 py-3.5 text-right">
                      <Link
                        to={`/products/jupiter/${m.code}`}
                        className="inline-flex items-center gap-1 text-[13px] font-semibold text-beam hover:underline"
                      >
                        Details <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Section>
    </>
  )
}
