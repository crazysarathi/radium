import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/admin/services'
import { cn } from '@/admin/utils'
import { Modal, Field, Input, Textarea, Button } from '@/admin/components/ui'

/**
 * Shared create/edit modal for accessories. `presetFor` pre-tags a new
 * accessory with product slugs (used by the per-product accessories page).
 */
export default function AccessoryFormModal({ open, onClose, initial, categories, presetFor = [], onSave }) {
  const isEdit = Boolean(initial)
  const [form, setForm] = useState(
    initial ?? { name: '', sku: '', category: '', description: '', for: presetFor, status: 'available' }
  )
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  const { data: products = [] } = useQuery({
    queryKey: [api.products.key],
    queryFn: () => api.products.list(),
  })

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))
  const toggleFor = (slug) =>
    set({ for: form.for.includes(slug) ? form.for.filter((s) => s !== slug) : [...form.for, slug] })

  const submit = async () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required.'
    if (!form.sku.trim()) errs.sku = 'SKU is required.'
    if (!form.category.trim()) errs.category = 'Category is required.'
    if (form.for.length === 0) errs.for = 'Pick at least one product family.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setBusy(true)
    const ok = await onSave(form)
    setBusy(false)
    if (ok) onClose()
  }

  return (
    <Modal open={open} onClose={onClose} wide title={isEdit ? `Edit — ${initial.name}` : 'New accessory'}>
      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name" required error={errors.name}>
            <Input value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder='Sliding Rail Kit — 28"' />
          </Field>
          <Field label="SKU" required error={errors.sku}>
            <Input value={form.sku} onChange={(e) => set({ sku: e.target.value.toUpperCase() })} placeholder="RAD-ACC-RK28" className="font-mono" />
          </Field>
        </div>
        <Field label="Category" required error={errors.category} hint="pick one or type a new one">
          <Input value={form.category} onChange={(e) => set({ category: e.target.value })} placeholder="Mounting" list="accessory-categories" />
          <datalist id="accessory-categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
        <Field label="Description">
          <Textarea rows={3} value={form.description} onChange={(e) => set({ description: e.target.value })} placeholder="What it is and when a site needs it…" />
        </Field>
        <Field label="Used with" required error={errors.for} hint="drives the “accessories for this product” lists">
          <div className="flex flex-wrap gap-2">
            {products.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => toggleFor(p.slug)}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-all',
                  form.for.includes(p.slug)
                    ? 'border-beam/60 bg-beam/15 text-beam shadow-glow'
                    : 'border-black/10 dark:border-white/10 text-muted-foreground hover:border-beam/30 hover:text-foreground'
                )}
              >
                {p.series ?? p.name}
              </button>
            ))}
          </div>
        </Field>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" loading={busy} onClick={submit}>
            {isEdit ? 'Save accessory' : 'Add accessory'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
