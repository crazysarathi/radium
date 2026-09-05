import { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Plus, HardDrive, Server, PenLine, Trash2 } from 'lucide-react'
import { api } from '@/admin/services'
import { useToast } from '@/admin/context/ToastContext'
import { useCollection } from '@/admin/hooks/useCollection'
import { useListControls } from '@/admin/hooks/useListControls'
import { decodeModelNumber, formatCapacity, slugify, cn } from '@/admin/utils'
import {
  Button, DataTable, SearchInput, Toolbar, Pagination,
  EmptyState, ConfirmDialog, Modal, Field, Input, Select, Toggle,
  StatusBadge, StringListEditor, ImageInput,
} from '@/admin/components/ui'

/** Rack units by bay count — mirrors the client's mapping. */
const RACK_UNITS = { 16: '3U', 24: '4U', 36: '4U', 60: '4U' }

/** Jupiter variants use the six-digit model-number decoder. */
function JupiterVariantModal({ open, onClose, initial, existing, product, onSave }) {
  const isEdit = Boolean(initial)
  const [code, setCode] = useState(initial?.code ?? '')
  const [rackUnits, setRackUnits] = useState(initial?.rackUnits ?? '4U')
  const [status, setStatus] = useState(initial?.status ?? 'available')
  const [busy, setBusy] = useState(false)

  const d = decodeModelNumber(code)
  const duplicate = !isEdit && existing.some((m) => m.code === code)
  const error =
    code.length === 6
      ? duplicate
        ? 'This model number already exists.'
        : d && !d.valid
          ? 'Drives installed cannot exceed the bay count.'
          : null
      : code.length > 0
        ? 'Model numbers are exactly six digits.'
        : null

  const legend = d
    ? [
        { label: 'Bays', value: d.bays },
        { label: 'Drive capacity', value: `${d.driveCapacityTb} TB` },
        { label: 'Drives installed', value: d.drivesInstalled },
        { label: 'Raw capacity', value: formatCapacity(d.rawCapacityTb) },
        { label: 'Bays free', value: d.baysFree },
      ]
    : []

  const submit = async () => {
    if (!d || !d.valid || duplicate) return
    setBusy(true)
    const ok = await onSave({
      code,
      name: `Jupiter SS ${code}`,
      family: 'jupiter',
      rackUnits,
      status,
    })
    setBusy(false)
    if (ok) onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? `Edit ${initial.name}` : 'New Jupiter SS variant'} subtitle={product.tagline}>
      <div className="space-y-5">
        <Field label="Model number" required error={error} hint="six digits">
          <Input
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '').slice(0, 6)
              setCode(v)
              const dd = decodeModelNumber(v)
              if (dd && RACK_UNITS[dd.bays]) setRackUnits(RACK_UNITS[dd.bays])
            }}
            placeholder="242016"
            className="font-mono text-lg tracking-[.3em]"
          />
        </Field>

        {/* Live decode — the same trick the client's home page teaches */}
        <div
          className={cn(
            'rounded-xl border p-4 transition-colors',
            d?.valid ? 'border-beam/25 bg-beam/[.06]' : 'border-black/[.08] dark:border-white/[.08] bg-black/[.02] dark:bg-white/[.02]'
          )}
        >
          {d ? (
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
              {legend.map((l) => (
                <li key={l.label}>
                  <p className="text-[10.5px] uppercase tracking-[.14em] text-muted-foreground">{l.label}</p>
                  <p className={cn('mt-0.5 font-mono text-[15px] font-bold', d.valid ? 'text-beam' : 'text-destructive')}>
                    {l.value}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[12.5px] text-muted-foreground">
              Enter six digits — e.g. <span className="font-mono text-beam/80">242016</span> is 24 bays, 20 TB drives, 16 installed.
            </p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Rack units" hint="auto from bay count">
            <Select value={rackUnits} onChange={(e) => setRackUnits(e.target.value)}>
              <option value="1U">1U</option>
              <option value="2U">2U</option>
              <option value="3U">3U</option>
              <option value="4U">4U</option>
            </Select>
          </Field>
          <Field label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="available">Available</option>
              <option value="roadmap">Roadmap</option>
            </Select>
          </Field>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" loading={busy} disabled={!d || !d.valid || Boolean(error)} onClick={submit}>
            {isEdit ? 'Save variant' : 'Add variant'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

/** Every other product: model name, rack units, photo and spec bullets. */
function VariantModal({ open, onClose, initial, product, onSave }) {
  const isEdit = Boolean(initial)
  const [form, setForm] = useState(
    initial ?? { name: '', family: product.id, rackUnits: '2U', img: '', bullets: [], status: 'available' }
  )
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  const submit = async () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Model name is required.'
    if (form.bullets.length === 0) errs.bullets = 'Add at least one spec bullet.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setBusy(true)
    const ok = await onSave({ ...form, family: product.id })
    setBusy(false)
    if (ok) onClose()
  }

  return (
    <Modal open={open} onClose={onClose} wide title={isEdit ? `Edit — ${initial.name}` : `New ${product.series ?? product.name} variant`} subtitle={product.tagline}>
      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Model name" required error={errors.name} hint="as printed on the line sheet">
            <Input value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="RSC-2ET3" className="font-mono" />
          </Field>
          <Field label="Rack units">
            <Select value={form.rackUnits} onChange={(e) => set({ rackUnits: e.target.value })}>
              <option value="1U">1U</option>
              <option value="2U">2U</option>
              <option value="3U">3U</option>
              <option value="4U">4U</option>
            </Select>
          </Field>
        </div>
        <Field label="Spec bullets" required error={errors.bullets} hint="shown on the variant card, in order">
          <StringListEditor
            value={form.bullets}
            onChange={(bullets) => set({ bullets })}
            placeholder='e.g. 2U 26.8" depth server storage'
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Photo" hint="appears in the variant grid">
            <ImageInput
              value={form.img}
              onChange={(img) => set({ img })}
              placeholder={`/products/${product.id}/…`}
              folder={`products/${product.id}`}
            />
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={(e) => set({ status: e.target.value })}>
              <option value="available">Available</option>
              <option value="roadmap">Unlisted</option>
            </Select>
          </Field>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" loading={busy} onClick={submit}>
            {isEdit ? 'Save variant' : 'Add variant'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

/**
 * The variants control for ONE product — rendered inside the right-side Sheet.
 * `readOnly` renders a plain viewer (no status/actions/add — used from the
 * products list); the full control lives on the Variants tab. `onChanged`
 * fires after every successful mutation so the host page can refresh.
 */
export default function VariantsManager({ product, onChanged, readOnly = false }) {
  const isJupiter = product.id === 'jupiter'
  const queryClient = useQueryClient()
  const toast = useToast()
  const { items, loading, create, update, remove } = useCollection(api.variants)

  // Segregation: this panel only ever shows the variants of THIS product.
  const variants = useMemo(() => (items ?? []).filter((m) => m.family === product.id), [items, product.id])

  const controls = useListControls(variants, {
    searchKeys: isJupiter ? ['code', 'name'] : ['name', 'id', 'bullets'],
    pageSize: 10,
  })
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const rows = useMemo(
    () =>
      isJupiter
        ? (controls.pageItems ?? []).map((m) => ({ ...m, decoded: decodeModelNumber(m.code) }))
        : controls.pageItems,
    [controls.pageItems, isJupiter]
  )

  // The client only renders a variant grid when the family is flagged for it.
  // Never throws: the variant itself was already saved when this runs, so a
  // failed flag PATCH must not wedge the modal in its busy state.
  const flagHasModels = async () => {
    if (product.hasModels) return
    try {
      await api.products.update(product.id, { hasModels: true })
      queryClient.invalidateQueries({ queryKey: [api.products.key] })
    } catch (e) {
      toast.error('Variant saved, but flagging the family failed', e.message)
    }
  }

  const jupiterColumns = [
    {
      key: 'code',
      label: 'Variant',
      render: (m) => (
        <div>
          <p className="font-mono text-[14px] font-bold tracking-wider text-beam">{m.code}</p>
          <p className="text-[12px] text-muted-foreground">{m.name}</p>
        </div>
      ),
    },
    { key: 'rackUnits', label: 'RU', width: 70, className: 'font-mono text-muted-foreground' },
    { key: 'bays', label: 'Bays', width: 80, render: (m) => <span className="font-mono">{m.decoded?.bays ?? '—'}</span> },
    {
      key: 'raw',
      label: 'Raw capacity',
      render: (m) => (
        <span className="font-semibold text-grad">{m.decoded ? formatCapacity(m.decoded.rawCapacityTb) : '—'}</span>
      ),
    },
    { key: 'status', label: 'Status', render: (m) => <StatusBadge status={m.status} /> },
  ]

  const genericColumns = [
    {
      key: 'name',
      label: 'Variant',
      render: (m) => (
        <div className="flex items-center gap-3.5">
          <span className="flex h-11 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-black/10 dark:border-white/10 bg-black/[.04] dark:bg-[#1a0709]/60">
            {m.img ? <img src={m.img} alt="" className="h-full w-full object-contain" loading="lazy" /> : <Server className="h-4 w-4 text-muted-foreground/50" />}
          </span>
          <div className="min-w-0">
            <p className="font-mono text-[13.5px] font-bold text-foreground">{m.name}</p>
            <p className="truncate text-[12px] text-muted-foreground">{m.bullets?.[0]}</p>
          </div>
        </div>
      ),
    },
    { key: 'rackUnits', label: 'RU', width: 70, className: 'font-mono text-muted-foreground' },
    {
      key: 'status',
      label: 'Status',
      render: (m) => (
        <div className="flex items-center gap-3">
          <Toggle
            checked={m.status === 'available'}
            onChange={async (on) => {
              const ok = await update(m.id, { status: on ? 'available' : 'roadmap' }, `${m.name} ${on ? 'listed' : 'unlisted'}.`)
              if (ok) onChanged?.()
            }}
          />
          <StatusBadge status={m.status} />
        </div>
      ),
    },
  ]

  const actionsColumn = {
    key: 'actions',
    label: 'Actions',
    width: 110,
    align: 'center',
    render: (m) => (
      <div className="flex justify-center gap-1.5">
        <button
          type="button"
          onClick={() => {
            setEditing(m)
            setFormOpen(true)
          }}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-beam/10 hover:text-beam"
          aria-label={`Edit ${m.name}`}
        >
          <PenLine className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setToDelete(m)}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
          aria-label={`Delete ${m.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    ),
  }

  const baseColumns = isJupiter ? jupiterColumns : genericColumns
  const columns = readOnly
    ? baseColumns.filter((c) => c.key !== 'status')
    : [...baseColumns, actionsColumn]

  return (
    <>
      <Toolbar>
        <SearchInput value={controls.query} onChange={controls.setQuery} placeholder="Search variants…" className="w-full sm:w-64" />
        {!readOnly && (
          <Button
            size="sm"
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <Plus className="h-4 w-4" />
            Add variant
          </Button>
        )}
      </Toolbar>

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        empty={
          <EmptyState
            icon={isJupiter ? HardDrive : Server}
            title="No variants yet"
            body={
              readOnly
                ? `${product.name} has no variants. Add them from the Variants tab.`
                : `${product.name} has no variants. Add the first one.`
            }
            action={
              readOnly ? null : (
                <Button size="sm" onClick={() => setFormOpen(true)}>
                  <Plus className="h-4 w-4" /> Add variant
                </Button>
              )
            }
          />
        }
      />

      <Pagination page={controls.page} pages={controls.pages} total={controls.total} onPage={controls.setPage} />

      {!readOnly && formOpen ? (
        isJupiter ? (
          <JupiterVariantModal
            open={formOpen}
            onClose={() => setFormOpen(false)}
            initial={editing}
            existing={variants}
            product={product}
            onSave={async (data) => {
              const ok = editing
                ? await update(editing.id, data, `Jupiter SS ${data.code} updated.`)
                : await create({ ...data, id: `jupiter-ss-${data.code}` }, `Jupiter SS ${data.code} added.`)
              if (ok) {
                await flagHasModels()
                onChanged?.()
              }
              return ok
            }}
          />
        ) : (
          <VariantModal
            open={formOpen}
            onClose={() => setFormOpen(false)}
            initial={editing}
            product={product}
            onSave={async (data) => {
              const ok = editing
                ? await update(editing.id, data, `${data.name} updated.`)
                : await create({ ...data, id: slugify(data.name.replace(/\(.*\)/, '')) }, `${data.name} added to ${product.name}.`)
              if (ok) {
                await flagHasModels()
                onChanged?.()
              }
              return ok
            }}
          />
        )
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
          message={`The variant disappears from the ${product.name} model grid on the client site.`}
        />
      )}
    </>
  )
}
