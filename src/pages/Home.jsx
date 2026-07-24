import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Server, HardDrive, Monitor, Cpu, ShieldCheck,
  Layers, Wrench, CheckCircle2, Box,
} from 'lucide-react'
import ChassisArt from '@/components/ChassisArt'
import ProductCard from '@/components/ProductCard'
import HeroSlider from '@/components/HeroSlider'
import { ThemeBackdrop, ThemeZone } from '@/components/ThemeField'
import { Button, Eyebrow, Section, SectionHead, Tilt, SplitText } from '@/components/ui'
import { products, categories, jupiterModels, decodeModelNumber } from '@/data/products'
import { solutions } from '@/data/site'
import { formatCapacity } from '@/lib/utils'

const CAT_ICON = { compute: Cpu, storage: HardDrive, chassis: Box, workstation: Monitor, edge: Server }

/* ------------------------------------------------------------------ */

function ProductLine() {
  const [active, setActive] = useState('all')
  const shown = active === 'all' ? products : products.filter((p) => p.category === active)

  return (
    <Section id="line">
      <div className="reveal flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHead
          eyebrow="The Radium line"
          title="Twelve families, one engineering baseline"
          body="Named after the planets, sized for the workload — plus the chassis line they are built in. Every family shares the same firmware baseline, the same management interface and the same support path."
          className="reveal-none"
        />
        <Link to="/products" className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-beam">
          All products
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="reveal mt-10 flex flex-wrap gap-2">
        {[{ key: 'all', label: 'All' }, ...categories].map((c) => {
          const Icon = CAT_ICON[c.key] ?? Layers
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setActive(c.key)}
              className={
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold transition-all ' +
                (active === c.key
                  ? 'border-beam/60 bg-beam/15 text-beam shadow-glow'
                  : 'border-white/10 text-muted-foreground hover:border-beam/30 hover:text-foreground')
              }
            >
              <Icon className="h-3.5 w-3.5" />
              {c.label}
            </button>
          )
        })}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </Section>
  )
}

/* ------------------------------------------------------------------ */

function ModelDecoder() {
  const [code, setCode] = useState('242016')
  const d = decodeModelNumber(code) ?? { bays: 0, driveCapacityTb: 0, drivesInstalled: 0, rawCapacityTb: 0, baysFree: 0, valid: false }
  const legend = [
    { label: 'Bays', value: d.bays, digits: code.slice(0, 2), color: '#ff4d5e' },
    { label: 'Drive capacity', value: `${d.driveCapacityTb} TB`, digits: code.slice(2, 4), color: '#ff97a1' },
    { label: 'Drives installed', value: d.drivesInstalled, digits: code.slice(4, 6), color: '#ffd6da' },
  ]

  return (
    <Section id="model-numbers" className="relative">
      <div className="glass overflow-hidden shadow-card">
        <div className="grid lg:grid-cols-[1fr_.9fr]">
          <div className="p-8 md:p-12">
            <Eyebrow>Storage server model numbers</Eyebrow>
            <SplitText as="h2" gradient text="The part number is the spec sheet" className="t-h2 mt-4" />
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
              Six digits, three pairs. Bay count, drive capacity, drives installed.
              Read a Radium storage server model number and you already know what is
              in the chassis and how much room is left.
            </p>

            <div className="mt-8">
              <label htmlFor="decoder" className="t-eyebrow text-beam/70">
                Try a model number
              </label>
              <div className="mt-3 flex flex-wrap gap-2">
                {jupiterModels.slice(0, 6).map((m) => (
                  <button
                    key={m.code}
                    type="button"
                    onClick={() => setCode(m.code)}
                    className={
                      'rounded-lg border px-3 py-1.5 font-mono text-[13px] transition-all ' +
                      (code === m.code
                        ? 'border-beam/60 bg-beam/15 text-beam'
                        : 'border-white/10 text-muted-foreground hover:border-beam/30 hover:text-foreground')
                    }
                  >
                    {m.code}
                  </button>
                ))}
              </div>
              <input
                id="decoder"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="mt-4 w-full rounded-xl border border-white/10 bg-[#1a0709]/60 px-4 py-3 font-mono text-lg tracking-[.3em] text-foreground outline-none transition-colors focus:border-beam/60 focus:ring-2 focus:ring-beam/20"
                aria-describedby="decoder-help"
              />
              <p id="decoder-help" className="mt-2 text-[12px] text-muted-foreground">
                Six digits — e.g. <span className="font-mono text-beam/80">242016</span> is Jupiter SS, 24 bays, 20 TB drives, 16 installed.
              </p>
            </div>
          </div>

          <div className="border-t border-white/[.07] bg-[#1a0709]/40 p-8 md:p-12 lg:border-l lg:border-t-0">
            <div className="flex justify-center gap-1.5 font-mono text-[34px] font-bold tracking-[.12em] md:text-[42px]">
              {legend.map((l) => (
                <span key={l.label} style={{ color: l.color }} className="tabular-nums">
                  {l.digits.padEnd(2, '–')}
                </span>
              ))}
            </div>

            <ul className="mt-7 space-y-3">
              {legend.map((l) => (
                <li key={l.label} className="flex items-center justify-between gap-4 border-b border-white/[.06] pb-3">
                  <span className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ background: l.color }} />
                    {l.label}
                  </span>
                  <span className="font-mono text-sm font-semibold text-foreground">{l.value}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-xl border border-beam/20 bg-beam/[.06] p-5">
              {d.valid && d.bays > 0 ? (
                <>
                  <p className="text-[11.5px] uppercase tracking-[.14em] text-muted-foreground">Raw capacity</p>
                  <p className="mt-1 text-3xl font-extrabold tracking-tight text-grad">{formatCapacity(d.rawCapacityTb)}</p>
                  <p className="mt-2 text-[13px] text-muted-foreground">
                    {d.baysFree} of {d.bays} bays free — room for another{' '}
                    <span className="text-beam">{formatCapacity(d.baysFree * d.driveCapacityTb)}</span> without a new chassis.
                  </p>
                </>
              ) : (
                <p className="text-[13px] text-muted-foreground">
                  Enter six digits. Drives installed cannot exceed the bay count.
                </p>
              )}
            </div>

            <div className="mt-6">
              <ChassisArt variant="rack" bays={d.bays || 16} filled={Math.min(d.drivesInstalled, d.bays) || 0} glow={false} />
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ------------------------------------------------------------------ */

function SolutionsStrip() {
  return (
    <Section id="solutions">
      <SectionHead
        eyebrow="Solutions"
        title="Specified as a system, not a shopping list"
        body="Most imaging projects fail at the seams — the archive sized for last year, the reading room bottlenecked on the network. Radium quotes the whole path."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {solutions.map((s) => (
          <Tilt key={s.slug} className="reveal h-full" max={6}>
            <Link
              to={`/solutions#${s.slug}`}
              className="group flex h-full flex-col rounded-glass border border-beam/16 bg-[rgba(30,12,14,.6)] p-6 backdrop-blur-[12px] transition-[border-color,box-shadow] duration-300 hover:border-beam/45 hover:shadow-[0_0_34px_-8px_rgba(255,77,94,.3)]"
            >
              <h3 className="t-h3 text-foreground transition-colors group-hover:text-beam">{s.title}</h3>
              <p className="mt-2.5 flex-1 text-[13.5px] leading-relaxed text-muted-foreground">{s.blurb}</p>
              <ul className="mt-5 space-y-1.5 border-t border-white/[.06] pt-4">
                {s.stack.map((line) => (
                  <li key={line} className="flex items-start gap-2 text-[12.5px] text-muted-foreground/85">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-beam/60" />
                    {line}
                  </li>
                ))}
              </ul>
            </Link>
          </Tilt>
        ))}
      </div>
    </Section>
  )
}

/* ------------------------------------------------------------------ */

function WhyRadium() {
  const items = [
    { icon: Layers, title: 'One line, top to bottom', body: 'Gateway, archive, compute and reading endpoint from a single vendor — one firmware baseline, one support number, no finger-pointing between suppliers.' },
    { icon: ShieldCheck, title: 'Built for retention, not refresh', body: 'Imaging archives are kept for years, not quarters. Capacity is designed to grow a drive at a time instead of forcing a migration.' },
    { icon: Wrench, title: 'Serviceable by design', body: 'Hot-swap drives, redundant power, tool-less access and out-of-band management on every rackmount product.' },
  ]

  return (
    <Section>
      <SectionHead eyebrow="Why Radium" title="Engineering decisions that outlast the purchase order" align="center" />
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {items.map((it) => (
          <div key={it.title} className="reveal glass glass-hover flex gap-5 p-6">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-beam/25 bg-beam/10">
              <it.icon className="h-5 w-5 text-beam" />
            </span>
            <div>
              <h3 className="text-[16px] font-bold text-foreground">{it.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{it.body}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* ------------------------------------------------------------------ */

function ClosingCta() {
  return (
    <Section tight>
      <div className="reveal glass relative overflow-hidden px-8 py-14 text-center md:px-16 md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,77,94,.6), transparent)' }}
        />
        <SplitText as="h2" gradient text="Tell us the study volume. We will size the rest." className="t-h2 mx-auto max-w-2xl" />
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Send us modality mix, annual study count and retention period. You get back a
          configuration, a model number and a capacity runway.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button to="/contact" size="lg">
            Request a quote <ArrowRight className="h-4 w-4" />
          </Button>
          <Button to="/resources" variant="outline" size="lg">
            Download datasheets
          </Button>
        </div>
      </div>
    </Section>
  )
}

/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <>
      {/* Fixed gradient field behind the page — retinted by whichever
          ThemeZone (or hero slide) is currently in view. */}
      <ThemeBackdrop />
      <HeroSlider />
      <ThemeZone theme="crimson"><ProductLine /></ThemeZone>
      <ThemeZone theme="azure"><ModelDecoder /></ThemeZone>
      <ThemeZone theme="violet"><SolutionsStrip /></ThemeZone>
      <ThemeZone theme="amber"><WhyRadium /></ThemeZone>
      <ThemeZone theme="crimson"><ClosingCta /></ThemeZone>
    </>
  )
}
