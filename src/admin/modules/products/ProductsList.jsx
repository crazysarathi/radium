import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Box, PenLine, Trash2, Cpu, HardDrive, Monitor, Server, Layers, Package } from 'lucide-react'
import { api } from '@/admin/services'
import { useCollection } from '@/admin/hooks/useCollection'
import { useListControls } from '@/admin/hooks/useListControls'
import {
  PageHeader, Button, DataTable, SearchInput, FilterChips, Toolbar,
  Pagination, EmptyState, StatusBadge, Badge, ConfirmDialog, Toggle, Sheet,
} from '@/admin/components/ui'
import VariantsManager from './VariantsManager'
import AccessoriesManager from './AccessoriesManager'

const CAT_ICON = { compute: Cpu, storage: HardDrive, chassis: Server, workstation: Monitor, edge: Layers }

/** Centered count pill opening a control sheet (variants / accessories). */
function CountChip({ icon: Icon, count, label, onClick }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-black/[.12] px-3 py-1 text-[12px] font-semibold text-muted-foreground transition-all hover:border-beam/40 hover:text-beam dark:border-white/12"
      aria-label={label}
    >
      <Icon className="h-3.5 w-3.5" />
      {count}
    </button>
  )
}

export default function ProductsList() {
  const navigate = useNavigate()
  const { items, loading, update, remove } = useCollection(api.products)
  const { items: categories } = useCollection(api.categories)
  const { items: variants } = useCollection(api.variants)
  const { items: accessories } = useCollection(api.accessories)
  const controls = useListControls(items, { searchKeys: ['name', 'series', 'tagline', 'category'], pageSize: 8 })
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  // Which control sheet is open: { type: 'variants' | 'accessories', product }
  const [sheet, setSheet] = useState(null)

  // Variants are segregated per product via their `family` field,
  // accessories via their `for` tags.
  const variantCount = (p) => (variants ?? []).filter((m) => m.family === p.id).length
  const accessoryCount = (p) =>
    (accessories ?? []).filter((a) => a.for?.includes(p.slug ?? p.id)).length

  const catFilters = [
    { value: 'all', label: 'All', count: items?.length },
    ...(categories ?? []).map((c) => ({
      value: c.key,
      label: c.label,
      icon: CAT_ICON[c.key],
      count: items?.filter((p) => p.category === c.key).length,
    })),
  ]

  const columns = [
    {
      key: 'name',
      label: 'Product',
      className: 'w-full max-w-0',
      render: (p) => (
        <div className="flex items-center gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-black/10 dark:border-white/10 bg-black/[.04] dark:bg-[#1a0709]/60">
            {p.images?.[0]?.src ? (
              <img src={p.images[0].src} alt="" className="h-full w-full object-contain" loading="lazy" />
            ) : (
              <Box className="h-4 w-4 text-muted-foreground/50" />
            )}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">{p.name}</p>
            <p className="truncate text-[12px] text-muted-foreground">{p.tagline}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (p) => <Badge tone="muted">{p.category}</Badge>,
    },
    { key: 'formFactor', label: 'Form factor', className: 'whitespace-nowrap text-muted-foreground' },
    {
      key: 'variants',
      label: 'Variants',
      align: 'center',
      render: (p) => (
        <CountChip
          icon={Layers}
          count={variantCount(p)}
          label={`Manage variants of ${p.name}`}
          onClick={() => setSheet({ type: 'variants', product: p })}
        />
      ),
    },
    {
      key: 'accessories',
      label: 'Accessories',
      align: 'center',
      render: (p) => (
        <CountChip
          icon={Package}
          count={accessoryCount(p)}
          label={`Manage accessories of ${p.name}`}
          onClick={() => setSheet({ type: 'accessories', product: p })}
        />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (p) => (
        <div className="flex items-center gap-3 whitespace-nowrap">
          <Toggle
            checked={p.status === 'available'}
            onChange={(on) => update(p.id, { status: on ? 'available' : 'roadmap' }, `${p.name} is now ${on ? 'available' : 'on the roadmap'}.`)}
          />
          <StatusBadge status={p.status} />
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: 110,
      align: 'center',
      render: (p) => (
        <div className="flex justify-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/products/${p.id}/edit`)
            }}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-beam/10 hover:text-beam"
            aria-label={`Edit ${p.name}`}
          >
            <PenLine className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setToDelete(p)
            }}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
            aria-label={`Delete ${p.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Catalogue"
        title="Products"
        body="The product families the whole site is built around — mega-nav, index, family pages, compare table and footer all read from this list."
        actions={
          <Button to="/products/new">
            <Plus className="h-4 w-4" />
            Add product
          </Button>
        }
      />

      <Toolbar>
        <SearchInput value={controls.query} onChange={controls.setQuery} placeholder="Search products…" className="w-full sm:w-72" />
        <FilterChips options={catFilters} value={controls.filters.category ?? 'all'} onChange={(v) => controls.setFilter('category', v)} />
      </Toolbar>

      <DataTable
        columns={columns}
        rows={controls.pageItems}
        loading={loading}
        onRowClick={(p) => navigate(`/products/${p.id}/edit`)}
        empty={
          <EmptyState
            icon={Box}
            title="No products found"
            body={controls.query ? 'No product matches that search.' : 'Add the first product family to get started.'}
            action={
              <Button to="/products/new" size="sm">
                <Plus className="h-4 w-4" /> Add product
              </Button>
            }
          />
        }
      />

      <Pagination page={controls.page} pages={controls.pages} total={controls.total} onPage={controls.setPage} />

      <Sheet
        open={Boolean(sheet)}
        onClose={() => setSheet(null)}
        wide
        title={sheet ? `${sheet.product.name} — ${sheet.type}` : ''}
        subtitle={
          sheet
            ? `Quick view. Add or edit from the ${sheet.type === 'variants' ? 'Variants' : 'Accessories'} tab.`
            : undefined
        }
      >
        {sheet?.type === 'variants' ? (
          <VariantsManager product={sheet.product} readOnly />
        ) : sheet ? (
          <AccessoriesManager product={sheet.product} readOnly />
        ) : null}
      </Sheet>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        busy={deleting}
        onConfirm={async () => {
          setDeleting(true)
          await remove(toDelete.id, `${toDelete.name} removed from the catalogue.`)
          setDeleting(false)
          setToDelete(null)
        }}
        title={`Delete ${toDelete?.name}?`}
        message="The family disappears from the mega-nav, product index, footer and compare table. Its variants are not deleted automatically."
      />
    </>
  )
}
