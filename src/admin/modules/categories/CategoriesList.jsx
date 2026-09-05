import { useMemo, useState } from 'react'
import { Plus, Shapes, PenLine, Trash2 } from 'lucide-react'
import { api } from '@/admin/services'
import { useCollection } from '@/admin/hooks/useCollection'
import { useListControls } from '@/admin/hooks/useListControls'
import {
  PageHeader, Button, DataTable, SearchInput, Toolbar, Pagination,
  EmptyState, ConfirmDialog, Badge,
} from '@/admin/components/ui'
import CategoryFormModal from './CategoryFormModal'

export default function CategoriesList() {
  const { items, loading, create, update, remove } = useCollection(api.categories)
  const { items: products } = useCollection(api.products)
  const controls = useListControls(items, { searchKeys: ['label', 'key', 'blurb'], pageSize: 8 })
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // How many products sit in each category — mirrors the backend's delete
  // guard, so the UI can warn before the server refuses.
  const productCounts = useMemo(() => {
    const counts = {}
    for (const p of products ?? []) counts[p.category] = (counts[p.category] ?? 0) + 1
    return counts
  }, [products])

  const columns = [
    {
      key: 'label',
      label: 'Category',
      render: (c) => (
        <div>
          <p className="font-semibold text-foreground">{c.label}</p>
          <p className="font-mono text-[11.5px] text-muted-foreground">{c.key}</p>
        </div>
      ),
    },
    {
      key: 'blurb',
      label: 'Blurb',
      render: (c) => (
        <span className="line-clamp-2 max-w-md text-[12.5px] text-muted-foreground">
          {c.blurb || '—'}
        </span>
      ),
    },
    {
      key: 'products',
      label: 'Products',
      width: 110,
      align: 'center',
      render: (c) => (
        <Badge tone={productCounts[c.key] ? 'beam' : 'muted'}>
          {productCounts[c.key] ?? 0}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: 110,
      align: 'center',
      render: (c) => {
        const inUse = productCounts[c.key] ?? 0
        return (
          <div className="flex justify-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setEditing(c)
                setFormOpen(true)
              }}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-beam/10 hover:text-beam"
              aria-label={`Edit ${c.label}`}
            >
              <PenLine className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={inUse > 0}
              onClick={() => setToDelete(c)}
              title={inUse > 0 ? `${inUse} product${inUse === 1 ? '' : 's'} still use this category` : undefined}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
              aria-label={`Delete ${c.label}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )
      },
    },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Catalogue"
        title="Categories"
        body="The category list behind the product form's dropdown and the site's catalogue filters. A category can only be deleted once no product uses it."
        actions={
          <Button
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <Plus className="h-4 w-4" />
            Add category
          </Button>
        }
      />

      <Toolbar>
        <SearchInput value={controls.query} onChange={controls.setQuery} placeholder="Search categories…" className="w-full sm:w-72" />
      </Toolbar>

      <DataTable
        columns={columns}
        rows={controls.pageItems}
        loading={loading}
        empty={
          <EmptyState
            icon={Shapes}
            title="No categories"
            body={controls.query ? 'No category matches that search.' : 'Add the first category.'}
            action={
              <Button size="sm" onClick={() => setFormOpen(true)}>
                <Plus className="h-4 w-4" /> Add category
              </Button>
            }
          />
        }
      />

      <Pagination page={controls.page} pages={controls.pages} total={controls.total} onPage={controls.setPage} />

      {formOpen ? (
        <CategoryFormModal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          initial={editing}
          existingKeys={(items ?? []).map((c) => c.key)}
          onSave={async (data) => {
            if (editing) return update(editing.id, { label: data.label, blurb: data.blurb }, `${data.label} updated.`)
            return create(data, `${data.label} added.`)
          }}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        busy={deleting}
        onConfirm={async () => {
          setDeleting(true)
          await remove(toDelete.id, `${toDelete.label} removed.`)
          setDeleting(false)
          setToDelete(null)
        }}
        title={`Delete ${toDelete?.label}?`}
        message="It disappears from the product form's category dropdown and the site's catalogue filters."
      />
    </>
  )
}
