import { useMemo, useState } from 'react'
import { Plus, Package, PenLine, Trash2 } from 'lucide-react'
import { api } from '@/admin/services'
import { useCollection } from '@/admin/hooks/useCollection'
import { useListControls } from '@/admin/hooks/useListControls'
import { slugify } from '@/admin/utils'
import {
  PageHeader, Button, DataTable, SearchInput, Toolbar, Pagination,
  EmptyState, ConfirmDialog, Badge, StatusBadge, Toggle, Sheet,
} from '@/admin/components/ui'
import AccessoryFormModal from './AccessoryFormModal'
import AccessoriesManager from '@/admin/modules/products/AccessoriesManager'

export default function AccessoriesList() {
  const { items, loading, create, update, remove, refresh } = useCollection(api.accessories)
  const { items: products } = useCollection(api.products)
  const controls = useListControls(items, { searchKeys: ['name', 'sku', 'category'], pageSize: 8 })
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [sheetProduct, setSheetProduct] = useState(null)

  // Accessories reference products by slug in `for`.
  const productBySlug = useMemo(
    () => new Map((products ?? []).map((p) => [p.slug ?? p.id, p])),
    [products]
  )

  const categories = useMemo(
    () => [...new Set((items ?? []).map((a) => a.category).filter(Boolean))].sort(),
    [items]
  )

  const columns = [
    {
      key: 'name',
      label: 'Accessory',
      render: (a) => (
        <div>
          <p className="font-semibold text-foreground">{a.name}</p>
          <p className="font-mono text-[11.5px] text-muted-foreground">{a.sku}</p>
        </div>
      ),
    },
    { key: 'category', label: 'Category', render: (a) => <Badge tone="muted">{a.category}</Badge> },
    {
      key: 'for',
      label: 'Used with',
      render: (a) => (
        <span className="flex flex-wrap items-center gap-1.5">
          {(a.for ?? []).slice(0, 3).map((slug) => {
            const product = productBySlug.get(slug)
            return (
              <button
                key={slug}
                type="button"
                onClick={() => product && setSheetProduct(product)}
                className="rounded-full border border-black/[.12] px-2 py-0.5 text-[11.5px] font-semibold text-muted-foreground transition-all hover:border-beam/40 hover:text-beam dark:border-white/12"
                aria-label={`Manage accessories of ${product?.name ?? slug}`}
              >
                {product?.name ?? slug}
              </button>
            )
          })}
          {a.for?.length > 3 ? (
            <span className="text-[11.5px] text-muted-foreground">+{a.for.length - 3}</span>
          ) : null}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (a) => (
        <div className="flex items-center gap-3">
          <Toggle
            checked={a.status === 'available'}
            onChange={(on) => update(a.id, { status: on ? 'available' : 'roadmap' }, `${a.name} ${on ? 'listed' : 'unlisted'}.`)}
          />
          <StatusBadge status={a.status} />
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: 110,
      align: 'center',
      render: (a) => (
        <div className="flex justify-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setEditing(a)
              setFormOpen(true)
            }}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-beam/10 hover:text-beam"
            aria-label={`Edit ${a.name}`}
          >
            <PenLine className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setToDelete(a)}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
            aria-label={`Delete ${a.name}`}
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
        title="Accessories"
        body="Rails, trays, drives, PSUs, NICs — each accessory lists the product families it is used with. Click a product to open its accessories control sheet."
        actions={
          <Button
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <Plus className="h-4 w-4" />
            Add accessory
          </Button>
        }
      />

      <Toolbar>
        <SearchInput value={controls.query} onChange={controls.setQuery} placeholder="Search accessories…" className="w-full sm:w-72" />
      </Toolbar>

      <DataTable
        columns={columns}
        rows={controls.pageItems}
        loading={loading}
        empty={
          <EmptyState
            icon={Package}
            title="No accessories"
            body={controls.query ? 'No accessory matches that search.' : 'Add the first accessory.'}
            action={
              <Button size="sm" onClick={() => setFormOpen(true)}>
                <Plus className="h-4 w-4" /> Add accessory
              </Button>
            }
          />
        }
      />

      <Pagination page={controls.page} pages={controls.pages} total={controls.total} onPage={controls.setPage} />

      <Sheet
        open={Boolean(sheetProduct)}
        onClose={() => setSheetProduct(null)}
        wide
        title={sheetProduct ? `${sheetProduct.name} — accessories` : ''}
        subtitle={sheetProduct ? `Only the accessories tagged for ${sheetProduct.name}. New ones are pre-tagged with this product.` : undefined}
      >
        {sheetProduct ? <AccessoriesManager product={sheetProduct} onChanged={refresh} /> : null}
      </Sheet>

      {formOpen ? (
        <AccessoryFormModal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          initial={editing}
          categories={categories}
          onSave={async (data) => {
            if (editing) return update(editing.id, data, `${data.name} updated.`)
            return create({ ...data, id: slugify(data.name) }, `${data.name} added.`)
          }}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        busy={deleting}
        onConfirm={async () => {
          setDeleting(true)
          await remove(toDelete.id, `${toDelete.name} removed.`)
          setDeleting(false)
          setToDelete(null)
        }}
        title={`Delete ${toDelete?.name}?`}
        message="It disappears from every product's accessory list and can no longer be added to enquiries."
      />
    </>
  )
}
