import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box, HardDrive, Server, Package, Layers, FileText,
  GalleryHorizontalEnd, Inbox, Plus, PenLine, Trash2, RotateCcw,
  ArrowRight, Activity,
} from 'lucide-react'
import { api, resetAllData } from '@/services'
import { useToast } from '@/context/ToastContext'
import { timeAgo, cn } from '@/utils'
import { Button, ConfirmDialog, Skeleton, Badge } from '@/components/ui'

const STATS = [
  { key: 'products', label: 'Product families', icon: Box, to: '/products' },
  { key: 'jupiterModels', label: 'Jupiter models', icon: HardDrive, to: '/models' },
  { key: 'chassisModels', label: 'Chassis models', icon: Server, to: '/chassis' },
  { key: 'accessories', label: 'Accessories', icon: Package, to: '/accessories' },
  { key: 'heroSlides', label: 'Hero slides', icon: GalleryHorizontalEnd, to: '/hero' },
  { key: 'solutions', label: 'Solutions', icon: Layers, to: '/solutions' },
  { key: 'resources', label: 'Resources', icon: FileText, to: '/resources' },
  { key: 'enquiries', label: 'Open enquiries', icon: Inbox, to: '/enquiries', accent: true },
]

const QUICK_ACTIONS = [
  { label: 'Add a product family', to: '/products/new', icon: Plus },
  { label: 'Add a Jupiter model', to: '/models', icon: HardDrive },
  { label: 'New hero slide', to: '/hero/new', icon: GalleryHorizontalEnd },
  { label: 'Edit company page', to: '/content/company', icon: PenLine },
  { label: 'Review enquiries', to: '/enquiries', icon: Inbox },
]

const ACT_ICON = { create: Plus, update: PenLine, delete: Trash2 }
const ACT_TONE = {
  create: 'border-emerald-400/35 bg-emerald-400/10 text-emerald-300',
  update: 'border-beam/35 bg-beam/10 text-beam',
  delete: 'border-destructive/40 bg-destructive/10 text-destructive',
}

export default function Dashboard() {
  const [counts, setCounts] = useState(null)
  const [activity, setActivity] = useState(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [resetting, setResetting] = useState(false)
  const toast = useToast()

  const load = async () => {
    const [products, models, chassis, accessories, hero, solutions, resources, enquiries, acts] =
      await Promise.all([
        api.products.list(),
        api.jupiterModels.list(),
        api.chassisModels.list(),
        api.accessories.list(),
        api.heroSlides.list(),
        api.solutions.list(),
        api.resources.list(),
        api.enquiries.list(),
        api.activity.list(),
      ])
    setCounts({
      products: products.length,
      jupiterModels: models.length,
      chassisModels: chassis.length,
      accessories: accessories.length,
      heroSlides: hero.length,
      solutions: solutions.length,
      resources: resources.length,
      enquiries: enquiries.filter((e) => e.status !== 'closed').length,
      newEnquiries: enquiries.filter((e) => e.status === 'new').length,
    })
    setActivity(acts)
  }

  useEffect(() => {
    load()
  }, [])

  const onReset = async () => {
    setResetting(true)
    await resetAllData()
    setCounts(null)
    setActivity(null)
    setConfirmReset(false)
    setResetting(false)
    toast.success('Demo data reset', 'All modules reloaded from the seed files.')
    load()
  }

  return (
    <>
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="t-eyebrow text-beam/70">Overview</p>
          <h1 className="t-h2 mt-2 text-foreground">
            Welcome back<span className="text-grad">.</span>
          </h1>
          <p className="mt-2.5 max-w-xl text-[13.5px] leading-relaxed text-muted-foreground">
            Everything the client site renders — products, models, copy, chrome — is editable here.
            Changes persist in this browser until the API goes live.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setConfirmReset(true)}>
          <RotateCcw className="h-3.5 w-3.5" />
          Reset demo data
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <Link
            key={s.key}
            to={s.to}
            className={cn(
              'glass glass-hover group p-5',
              s.accent && counts?.newEnquiries > 0 && 'border-beam/40'
            )}
          >
            <div className="flex items-start justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-beam/25 bg-beam/10">
                <s.icon className="h-4.5 w-4.5 text-beam" />
              </span>
              {s.accent && counts?.newEnquiries > 0 ? <Badge tone="beam">{counts.newEnquiries} new</Badge> : null}
            </div>
            {counts ? (
              <p className="mt-4 text-[30px] font-extrabold leading-none tracking-tight text-grad">{counts[s.key]}</p>
            ) : (
              <Skeleton className="mt-5 h-7 w-12" />
            )}
            <p className="mt-1.5 text-[11.5px] uppercase tracking-[.14em] text-muted-foreground/75">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
        {/* Recent activity */}
        <section className="glass p-6 shadow-card md:p-7">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2.5 text-[15px] font-bold text-foreground">
              <Activity className="h-4 w-4 text-beam" />
              Recent activity
            </h2>
            <span className="text-[11.5px] text-muted-foreground">last {activity?.length ?? '…'} events</span>
          </div>
          <ul className="mt-5 space-y-1">
            {activity === null
              ? Array.from({ length: 5 }).map((_, i) => (
                  <li key={i} className="flex items-center gap-3.5 py-2.5">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-4 flex-1" />
                  </li>
                ))
              : activity.slice(0, 8).map((a) => {
                  const Icon = ACT_ICON[a.type] ?? PenLine
                  return (
                    <li key={a.id} className="flex items-center gap-3.5 border-b border-white/[.05] py-3 last:border-0">
                      <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border', ACT_TONE[a.type] ?? ACT_TONE.update)}>
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] text-foreground/90">{a.label}</p>
                        <p className="text-[11.5px] text-muted-foreground">{a.module}</p>
                      </div>
                      <span className="shrink-0 text-[11.5px] text-muted-foreground/70">{timeAgo(a.at)}</span>
                    </li>
                  )
                })}
          </ul>
        </section>

        {/* Quick actions */}
        <section className="glass p-6 shadow-card md:p-7">
          <h2 className="text-[15px] font-bold text-foreground">Quick actions</h2>
          <div className="mt-5 space-y-2">
            {QUICK_ACTIONS.map((qa) => (
              <Link
                key={qa.label}
                to={qa.to}
                className="group flex items-center gap-3.5 rounded-xl border border-white/[.07] px-4 py-3 transition-all hover:border-beam/40 hover:bg-beam/[.06]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-beam/25 bg-beam/10">
                  <qa.icon className="h-3.5 w-3.5 text-beam" />
                </span>
                <span className="flex-1 text-[13.5px] font-medium text-foreground/90">{qa.label}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-beam" />
              </Link>
            ))}
          </div>
          <div className="hairline my-6" />
          <p className="text-[12.5px] leading-relaxed text-muted-foreground">
            The service layer mirrors REST — when the backend is ready, swap the
            localStorage calls in <span className="font-mono text-foreground/80">src/services/api.js</span> for
            fetch() and every screen keeps working.
          </p>
        </section>
      </div>

      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={onReset}
        busy={resetting}
        title="Reset demo data?"
        confirmLabel="Reset everything"
        message="All local changes across every module are discarded and the seed content (the live site's current data) is restored. Your session stays signed in."
      />
    </>
  )
}
