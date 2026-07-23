import { useMemo, useState } from 'react'
import { Download, Search, FileText } from 'lucide-react'
import { PageHero, Breadcrumb, Section, DraftNotice, Badge } from '@/components/ui'
import { resources } from '@/data/site'

export default function Resources() {
  const [q, setQ] = useState('')
  const [type, setType] = useState('all')

  const types = useMemo(() => Array.from(new Set(resources.map((r) => r.type))), [])

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return resources.filter(
      (r) =>
        (type === 'all' || r.type === type) &&
        (!needle || r.title.toLowerCase().includes(needle) || r.type.toLowerCase().includes(needle))
    )
  }, [q, type])

  return (
    <>
      <PageHero
        breadcrumb={<Breadcrumb trail={[{ label: 'Home', to: '/' }, { label: 'Resources' }]} />}
        eyebrow="Resources"
        title="Datasheets, guides and manuals"
        body="Everything needed to specify, install and support Radium hardware. Wire these entries to real files when the documents are ready."
      />

      <Section tight>
        <DraftNotice>
          Placeholder downloads. Add real file URLs in{' '}
          <span className="font-mono text-foreground/80">src/data/site.js</span> →{' '}
          <span className="font-mono text-foreground/80">resources</span>.
        </DraftNotice>

        <div className="reveal glass mt-8 flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {['all', ...types].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={
                  'rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-all ' +
                  (type === t
                    ? 'border-beam/60 bg-beam/15 text-beam'
                    : 'border-white/10 text-muted-foreground hover:border-beam/30 hover:text-foreground')
                }
              >
                {t === 'all' ? 'All' : t}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search resources…"
              aria-label="Search resources"
              className="w-full rounded-full border border-white/10 bg-[#1a0709]/60 py-2 pl-9 pr-4 text-[13px] outline-none transition-colors focus:border-beam/60 md:w-64"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((r) => (
            <button
              key={r.title}
              type="button"
              className="reveal glass glass-hover group flex items-start gap-4 p-5 text-left"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-beam/25 bg-beam/10">
                <FileText className="h-4.5 w-4.5 text-beam" />
              </span>
              <span className="min-w-0 flex-1">
                <Badge tone="muted" className="mb-2">{r.type}</Badge>
                <span className="block text-[14.5px] font-bold leading-snug text-foreground group-hover:text-beam">
                  {r.title}
                </span>
                <span className="mt-1.5 block text-[12px] text-muted-foreground">{r.meta}</span>
              </span>
              <Download className="mt-1 h-4 w-4 shrink-0 text-beam/50 transition-colors group-hover:text-beam" />
            </button>
          ))}
        </div>

        {shown.length === 0 && (
          <div className="glass mt-6 p-12 text-center text-muted-foreground">No resources match that search.</div>
        )}
      </Section>
    </>
  )
}
