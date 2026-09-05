import { useState } from 'react'
import { slugify } from '@/admin/utils'
import { Modal, Field, Input, Textarea, Button } from '@/admin/components/ui'

/**
 * Shared create/edit modal for categories. The key (id) is derived from the
 * label on create and locked afterwards — products reference it as a foreign
 * key, so it can never change.
 */
export default function CategoryFormModal({ open, onClose, initial, existingKeys = [], onSave }) {
  const isEdit = Boolean(initial)
  const [form, setForm] = useState(
    initial
      ? { label: initial.label, key: initial.key, blurb: initial.blurb ?? '' }
      : { label: '', key: '', blurb: '' }
  )
  const [keyTouched, setKeyTouched] = useState(false)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  const setLabel = (label) =>
    set(keyTouched || isEdit ? { label } : { label, key: slugify(label) })

  const submit = async () => {
    const errs = {}
    if (!form.label.trim()) errs.label = 'Label is required.'
    if (!isEdit) {
      if (!form.key.trim()) errs.key = 'Key is required.'
      else if (existingKeys.includes(form.key)) errs.key = 'That key is already taken.'
    }
    setErrors(errs)
    if (Object.keys(errs).length) return
    setBusy(true)
    const ok = await onSave(
      isEdit
        ? { label: form.label.trim(), blurb: form.blurb.trim() || null }
        : { id: form.key, label: form.label.trim(), blurb: form.blurb.trim() || null }
    )
    setBusy(false)
    if (ok) onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? `Edit — ${initial.label}` : 'New category'}>
      <div className="space-y-5">
        <Field label="Label" required error={errors.label}>
          <Input value={form.label} onChange={(e) => setLabel(e.target.value)} placeholder="Compute" />
        </Field>
        <Field
          label="Key"
          required={!isEdit}
          error={errors.key}
          hint={isEdit ? 'keys are permanent — products reference them' : 'used in URLs and product records'}
        >
          <Input
            value={form.key}
            disabled={isEdit}
            onChange={(e) => {
              setKeyTouched(true)
              set({ key: slugify(e.target.value) })
            }}
            placeholder="compute"
            className="font-mono"
          />
        </Field>
        <Field label="Blurb" hint="short line shown on the site's catalogue filters">
          <Textarea rows={3} value={form.blurb} onChange={(e) => set({ blurb: e.target.value })} placeholder="Rack and tower systems for every core count…" />
        </Field>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" loading={busy} onClick={submit}>
            {isEdit ? 'Save category' : 'Add category'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
