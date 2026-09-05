import { useMemo, useState } from 'react'
import { Plus, Package, PenLine, Trash2 } from 'lucide-react'
import { api } from '@/admin/services'
import { useCollection } from '@/admin/hooks/useCollection'
import { useListControls } from '@/admin/hooks/useListControls'
import { slugify } from '@/admin/utils'
import {
  Button, DataTable, SearchInput, Toolbar, Pagination,
  EmptyState, ConfirmDialog, Badge, StatusBadge, Toggle,
} from '@/admin/components/ui'
import AccessoryFormModal from '@/admin/modules/accessories/AccessoryFormModal'

/**
 * The accessories control for ONE product — rendered inside the right-side
 * Sheet. `readOnly` renders a plain viewer (no status/actions/add — used from
 * the products list); the full control lives on the Accessories tab. New
 * accessories are pre-tagged with this product; `onChanged` fires after every
 * successful mutation so the host page can refresh its data.
 */
export default function AccessoriesManager({ product, onChanged, readOnly = false }) {
  const { items, loading, create, update, remove } = useCollection(api.accessories)

  const slug = product.slug ?? product.id

  // Segregation: only the accessories tagged for THIS product.
  const accessories = useMemo(
    () => (items ?? []).filter((a) => a.for?.includes(slug)),
    [items, slug]
  )

  const controls = useListControls(accessories, { searchKeys: ['name', 'sku', 'category'], pageSize: 10 })
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Category suggestions come from the whole catalogue, not just this product.
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
      key: 'status',
      label: 'Status',
      render: (a) => (
        <div className="flex items-center gap-3">
          <Toggle
            checked={a.status === 'available'}
            onChange={async (on) => {
              const ok = await update(a.id, { status: on ? 'available' : 'roadmap' }, `${a.name} ${on ? 'listed' : 'unlisted'}.`)
              if (ok) onChanged?.()
            }}
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

  const visibleColumns = readOnly
    ? columns.filter((c) => c.key !== 'status' && c.key !== 'actions')
    : columns

  return (
    <>
      <Toolbar>
        <SearchInput value={controls.query} onChange={controls.setQuery} placeholder="Search accessories…" className="w-full sm:w-64" />
        {!readOnly && (
          <Button
            size="sm"
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <Plus className="h-4 w-4" />
            Add accessory
          </Button>
        )}
      </Toolbar>

      <DataTable
        columns={visibleColumns}
        rows={controls.pageItems}
        loading={loading}
        empty={
          <EmptyState
            icon={Package}
            title="No accessories yet"
            body={
              readOnly
                ? `Nothing is tagged for ${product.name}. Add accessories from the Accessories tab.`
                : `Nothing is tagged for ${product.name}. Add one — it will be pre-tagged with this product.`
            }
            action={
              readOnly ? null : (
                <Button size="sm" onClick={() => setFormOpen(true)}>
                  <Plus className="h-4 w-4" /> Add accessory
                </Button>
              )
            }
          />
        }
      />

      <Pagination page={controls.page} pages={controls.pages} total={controls.total} onPage={controls.setPage} />

      {!readOnly && formOpen ? (
        <AccessoryFormModal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          initial={editing}
          categories={categories}
          presetFor={[slug]}
          onSave={async (data) => {
            const ok = editing
              ? await update(editing.id, data, `${data.name} updated.`)
              : await create({ ...data, id: slugify(data.name) }, `${data.name} added to ${product.name}.`)
            if (ok) onChanged?.()
            return ok
          }}
        />
      ) : null}

      {!readOnly && (
        <ConfirmDialog
          open={Boolean(toDelete)}
          onClose={() => setToDelete(null)}
          busy={deleting}
          onConfirm={async () => {
            setDeleting(true)
            const ok = await remove(toDelete.id, `${toDelete.name} removed.`)
            if (ok) onChanged?.()
            setDeleting(false)
            setToDelete(null)
          }}
          title={`Delete ${toDelete?.name}?`}
          message="The accessory is removed from EVERY product it is tagged with, not just this one. To detach it from just this product, edit it and untick the product instead."
        />
      )}
    </>
  )
}
