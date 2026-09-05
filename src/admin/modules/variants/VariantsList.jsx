import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Layers, Server, ArrowUpRight } from 'lucide-react'
import { api } from '@/admin/services'
import { useCollection } from '@/admin/hooks/useCollection'
import { useListControls } from '@/admin/hooks/useListControls'
import { decodeModelNumber, formatCapacity } from '@/admin/utils'
import {
  PageHeader, Button, DataTable, SearchInput, Toolbar, Pagination,
  EmptyState, FilterChips, StatusBadge, Toggle,
} from '@/admin/components/ui'

/**
 * Overview of every variant across all product families. Clicking a family
 * (or Manage) navigates to that product's variants control page — the form
 * differs per family, so adding/editing lives there.
 */
export default function VariantsList() {
  const { items, loading, update } = useCollection(api.variants)
  const { items: products } = useCollection(api.products)

  const productById = useMemo(
    () => new Map((products ?? []).map((p) => [p.id, p])),
    [products]
  )

  const familyFilters = useMemo(
    () => [
      { value: 'all', label: 'All families' },
      ...(products ?? [])
        .filter((p) => (items ?? []).some((m) => m.family === p.id))
        .map((p) => ({ value: p.id, label: p.series ?? p.name })),
    ],
    [products, items]
  )

  const controls = useListControls(items ?? [], {
    searchKeys: ['name', 'code', 'family'],
    pageSize: 10,
  })

  const columns = [
    {
      key: 'name',
      label: 'Variant',
      render: (m) => {
        const decoded = m.code ? decodeModelNumber(m.code) : null
        return (
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-black/10 dark:border-white/10 bg-black/[.04] dark:bg-[#1a0709]/60">
              {m.img ? (
                <img src={m.img} alt="" className="h-full w-full object-contain" loading="lazy" />
              ) : m.code ? (
                <span className="font-mono text-[11px] font-bold tracking-wider text-beam">{m.code}</span>
              ) : (
                <Server className="h-4 w-4 text-muted-foreground/50" />
              )}
            </span>
            <div className="min-w-0">
              <p className="font-mono text-[13.5px] font-bold text-foreground">{m.name}</p>
              <p className="truncate text-[12px] text-muted-foreground">
                {decoded
                  ? `${decoded.bays} bays · ${formatCapacity(decoded.rawCapacityTb)} raw`
                  : m.bullets?.[0]}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      key: 'family',
      label: 'Family',
      render: (m) => {
        const product = productById.get(m.family)
        return (
          <Link
            to={`/products/${m.family}/variants`}
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-foreground transition-colors hover:text-beam"
          >
            {product?.name ?? m.family}
            <ArrowUpRight className="h-3.5 w-3.5 opacity-50" />
          </Link>
        )
      },
    },
    { key: 'rackUnits', label: 'RU', width: 70, className: 'font-mono text-muted-foreground' },
    {
      key: 'status',
      label: 'Status',
      render: (m) => (
        <div className="flex items-center gap-3">
          <Toggle
            checked={m.status === 'available'}
            onChange={(on) => update(m.id, { status: on ? 'available' : 'roadmap' }, `${m.name} ${on ? 'listed' : 'unlisted'}.`)}
          />
          <StatusBadge status={m.status} />
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: 110,
      align: 'center',
      render: (m) => (
        <Button to={`/products/${m.family}/variants`} variant="ghost" size="sm">
          Manage
        </Button>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Catalogue"
        title="Variants"
        body="Every model variant across all product families in one list. Click a family (or Manage) to open its control page and add or edit variants there."
      />

      <Toolbar>
        <SearchInput value={controls.query} onChange={controls.setQuery} placeholder="Search variants…" className="w-full sm:w-72" />
        <FilterChips options={familyFilters} value={controls.filters.family ?? 'all'} onChange={(v) => controls.setFilter('family', v)} />
      </Toolbar>

      <DataTable
        columns={columns}
        rows={controls.pageItems}
        loading={loading}
        empty={
          <EmptyState
            icon={Layers}
            title="No variants yet"
            body="No product family has variants. Open a product and add its first variant."
            action={
              <Button to="/products" size="sm">
                Go to products
              </Button>
            }
          />
        }
      />

      <Pagination page={controls.page} pages={controls.pages} total={controls.total} onPage={controls.setPage} />
    </>
  )
}
