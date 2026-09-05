import { Link } from 'react-router-dom'
import {
  Box, Layers, Package, Inbox, Shapes, HistoryIcon,
  Plus, PenLine, Trash2, ArrowUpRight, AlertTriangle,
} from 'lucide-react'
import { api } from '@/admin/services'
import { useCollection } from '@/admin/hooks/useCollection'
import { timeAgo, cn } from '@/admin/utils'
import { PageHeader, Badge, StatusBadge, Skeleton, EmptyState, Button } from '@/admin/components/ui'

const ACT_ICON = { create: Plus, update: PenLine, delete: Trash2 }
const ACT_TONE = {
  create: 'border-emerald-400/35 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300',
  update: 'border-beam/35 bg-beam/10 text-beam',
  delete: 'border-destructive/40 bg-destructive/10 text-destructive',
}

/** KPI stat tile — label, headline count, context line; the whole tile links
    to its section. `hot` puts the beam glow on (used for actionable counts). */
function StatTile({ to, icon: Icon, label, value, context, hot = false }) {
  return (
    <Link
      to={to}
      className={cn(
        'glass glass-hover group flex flex-col gap-4 rounded-glass p-5 shadow-card transition-all',
        hot && 'border-beam/35 shadow-glow'
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-xl border',
            hot ? 'border-beam/40 bg-beam/15 text-beam' : 'border-black/[.08] dark:border-white/[.09] bg-black/[.03] dark:bg-white/[.04] text-muted-foreground'
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground/0 transition-all group-hover:text-muted-foreground/70" />
      </div>
      <div>
        <div className="text-[28px] font-bold leading-none text-foreground">
          {value ?? <Skeleton className="h-7 w-10" />}
        </div>
        <p className="mt-2 text-[12.5px] font-semibold text-muted-foreground">{label}</p>
        {context ? <p className="mt-0.5 text-[11.5px] text-muted-foreground/70">{context}</p> : null}
      </div>
    </Link>
  )
}

/** Card shell shared by the dashboard panels. */
function Panel({ title, action, children, className }) {
  return (
    <section className={cn('glass rounded-glass p-5 shadow-card', className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[13px] font-bold uppercase tracking-[.12em] text-muted-foreground">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

function PanelLink({ to, children }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-beam transition-colors hover:text-beam-hover">
      {children}
      <ArrowUpRight className="h-3.5 w-3.5" />
    </Link>
  )
}

function ListSkeleton({ rows = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-9 w-full" />
      ))}
    </div>
  )
}

export default function Dashboard() {
  const productsQ = useCollection(api.products)
  const categoriesQ = useCollection(api.categories)
  const variantsQ = useCollection(api.variants)
  const accessoriesQ = useCollection(api.accessories)
  const enquiriesQ = useCollection(api.enquiries)
  const activityQ = useCollection(api.activity)

  const { items: products } = productsQ
  const { items: categories } = categoriesQ
  const { items: variants } = variantsQ
  const { items: accessories } = accessoriesQ
  const { items: enquiries } = enquiriesQ
  const { items: activity } = activityQ

  // A failed list otherwise looks exactly like loading (endless skeletons) —
  // surface it with a retry that refetches only what failed.
  const failed = [productsQ, categoriesQ, variantsQ, accessoriesQ, enquiriesQ, activityQ].filter(
    (q) => q.error && q.items === null
  )

  const newEnquiries = enquiries?.filter((e) => e.status === 'new').length
  const liveProducts = products?.filter((p) => p.status === 'available').length

  // Products per category, in the categories' own order — single-hue bars,
  // longest bar = the largest category.
  const categoryRows = (categories ?? []).map((c) => ({
    key: c.key,
    label: c.label,
    count: (products ?? []).filter((p) => p.category === c.key).length,
  }))
  const maxCategory = Math.max(1, ...categoryRows.map((r) => r.count))

  const recentEnquiries = [...(enquiries ?? [])]
    .sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt))
    .slice(0, 5)

  // `interest` stores a product slug (or 'trade-in'/'other') — show the
  // product's name, the same resolution the inbox does.
  const interestLabel = (slug) => products?.find((p) => p.slug === slug)?.name ?? slug
  const recentActivity = (activity ?? []).slice(0, 8)

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        body="The whole console at a glance — catalogue size, what's in the inbox, and the latest changes."
      />

      {failed.length > 0 && (
        <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3">
          <p className="flex items-center gap-2.5 text-[13px] font-semibold text-destructive">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Some data failed to load — {failed[0].error}
          </p>
          <Button size="sm" variant="ghost" onClick={() => failed.forEach((q) => q.refresh())}>
            Try again
          </Button>
        </div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatTile
          to="/products"
          icon={Box}
          label="Products"
          value={products?.length}
          context={
            products
              ? `${liveProducts} available · ${products.length - liveProducts} on the roadmap`
              : null
          }
        />
        <StatTile
          to="/variants"
          icon={Layers}
          label="Variants"
          value={variants?.length}
          context={variants ? `across ${new Set(variants.map((m) => m.family)).size} families` : null}
        />
        <StatTile
          to="/accessories"
          icon={Package}
          label="Accessories"
          value={accessories?.length}
          context={
            accessories
              ? `${new Set(accessories.flatMap((a) => a.category ? [a.category] : [])).size} categories`
              : null
          }
        />
        <StatTile
          to="/enquiries"
          icon={Inbox}
          label="New enquiries"
          value={newEnquiries}
          context={enquiries ? `${enquiries.length} total in the inbox` : null}
          hot={(newEnquiries ?? 0) > 0}
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* Catalogue mix — one hue, magnitude by length, values in text ink */}
        <Panel
          title="Products by category"
          action={<PanelLink to="/categories">Categories</PanelLink>}
        >
          {categories === null || products === null ? (
            <ListSkeleton rows={5} />
          ) : categoryRows.length === 0 ? (
            <EmptyState icon={Shapes} title="No categories yet" body="Create categories to structure the catalogue." />
          ) : (
            <ul className="space-y-3.5">
              {categoryRows.map((row) => (
                <li key={row.key}>
                  <Link to={`/products`} className="group block">
                    <div className="mb-1.5 flex items-baseline justify-between gap-3">
                      <span className="text-[13px] font-semibold text-foreground/85 transition-colors group-hover:text-beam">
                        {row.label}
                      </span>
                      <span className="text-[12.5px] font-semibold tabular-nums text-muted-foreground">
                        {row.count}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-beam/[.08]">
                      <div
                        className="h-full rounded-r-full bg-accent-grad"
                        style={{ width: `${(row.count / maxCategory) * 100}%` }}
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* Inbox — newest five, status carried by badges */}
        <Panel title="Recent enquiries" action={<PanelLink to="/enquiries">Open inbox</PanelLink>}>
          {enquiries === null ? (
            <ListSkeleton rows={5} />
          ) : recentEnquiries.length === 0 ? (
            <EmptyState icon={Inbox} title="Inbox is empty" body="Enquiries submitted on the site will land here." />
          ) : (
            <ul className="divide-y divide-black/[.05] dark:divide-white/[.05]">
              {recentEnquiries.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className={cn('truncate text-[13.5px] font-semibold', e.status === 'new' ? 'text-foreground' : 'text-foreground/70')}>
                      {e.name}
                    </p>
                    <p className="truncate text-[12px] text-muted-foreground">
                      {e.interest ? `Interested in ${interestLabel(e.interest)}` : e.email}
                      <span className="text-muted-foreground/60"> · {timeAgo(e.receivedAt)}</span>
                    </p>
                  </div>
                  <StatusBadge status={e.status} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      {/* Latest changes across the console */}
      <Panel
        title="Recent activity"
        action={<PanelLink to="/history">Full history</PanelLink>}
        className="mt-5"
      >
        {activity === null ? (
          <ListSkeleton rows={4} />
        ) : recentActivity.length === 0 ? (
          <EmptyState icon={HistoryIcon} title="No history" body="Changes you make in the console will show up here." />
        ) : (
          <ul className="grid gap-x-8 lg:grid-cols-2">
            {recentActivity.map((a) => {
              const Icon = ACT_ICON[a.type] ?? PenLine
              return (
                <li key={a.id ?? `${a.at}-${a.label}`} className="flex items-center gap-3.5 border-b border-black/[.05] dark:border-white/[.05] py-2.5 last:border-0 lg:[&:nth-last-child(2)]:border-0">
                  <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border', ACT_TONE[a.type] ?? ACT_TONE.update)}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <p className="min-w-0 flex-1 truncate text-[13px] text-foreground/85">{a.label}</p>
                  <Badge tone="muted" className="hidden sm:inline-flex">{a.module}</Badge>
                  <span className="shrink-0 text-[12px] text-muted-foreground">{timeAgo(a.at)}</span>
                </li>
              )
            })}
          </ul>
        )}
      </Panel>
    </>
  )
}
