import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, Plus, Trash2, X } from 'lucide-react'
import { api } from '@/services'
import { useToast } from '@/context/ToastContext'
import { slugify } from '@/utils'
import {
  PageHeader, Button, Field, Input, Textarea, Select, Toggle,
  StringListEditor, RowListEditor, ImageInput, PageLoading,
} from '@/components/ui'

const BLANK = {
  name: '',
  series: '',
  tagline: '',
  category: 'compute',
  status: 'available',
  note: '',
  formFactor: '',
  hasModels: false,
  summary: '',
  highlights: [],
  applications: [],
  specs: [],
  images: [],
}

/** Spec groups: name + rows of [label, value] pairs (client data shape). */
function SpecsEditor({ value, onChange }) {
  const setGroup = (i, patch) => {
    const next = value.slice()
    next[i] = { ...next[i], ...patch }
    onChange(next)
  }

  return (
    <div className="space-y-4">
      {value.map((group, i) => (
        <div key={i} className="rounded-xl border border-white/[.08] bg-white/[.02] p-4">
          <div className="mb-3 flex items-center gap-2">
            <Input
              value={group.group ?? ''}
              onChange={(e) => setGroup(i, { group: e.target.value })}
              placeholder="Group name — e.g. Processor"
              className="font-semibold"
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
              aria-label="Remove group"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2">
            {(group.rows ?? []).map((row, j) => (
              <div key={j} className="flex items-center gap-2">
                <input
                  value={row[0] ?? ''}
                  onChange={(e) => {
                    const rows = group.rows.map((r, k) => (k === j ? [e.target.value, r[1]] : r))
                    setGroup(i, { rows })
                  }}
                  placeholder="Label"
                  className="field-input sm:max-w-[220px]"
                />
                <input
                  value={row[1] ?? ''}
                  onChange={(e) => {
                    const rows = group.rows.map((r, k) => (k === j ? [r[0], e.target.value] : r))
                    setGroup(i, { rows })
                  }}
                  placeholder="Value"
                  className="field-input"
                />
                <button
                  type="button"
                  onClick={() => setGroup(i, { rows: group.rows.filter((_, k) => k !== j) })}
                  className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                  aria-label="Remove row"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setGroup(i, { rows: [...(group.rows ?? []), ['', '']] })}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/12 px-3 py-1 text-[12px] font-semibold text-muted-foreground transition-all hover:border-beam/40 hover:text-foreground"
            >
              <Plus className="h-3 w-3" /> Row
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, { group: '', rows: [['', '']] }])}
        className="inline-flex items-center gap-2 rounded-full border border-beam/30 px-4 py-1.5 text-[12.5px] font-semibold text-beam transition-all hover:border-beam/70 hover:bg-beam/10"
      >
        <Plus className="h-3.5 w-3.5" /> Add spec group
      </button>
    </div>
  )
}

/** Gallery editor — label + image path/upload per row. */
function ImagesEditor({ value, onChange }) {
  const setRow = (i, patch) => {
    const next = value.slice()
    next[i] = { ...next[i], ...patch }
    onChange(next)
  }
  return (
    <div className="space-y-3">
      {value.map((img, i) => (
        <div key={i} className="rounded-xl border border-white/[.08] bg-white/[.02] p-3.5">
          <div className="mb-2.5 flex items-center gap-2">
            <Input
              value={img.label ?? ''}
              onChange={(e) => setRow(i, { label: e.target.value })}
              placeholder="Label — e.g. Front 45°"
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
              aria-label="Remove image"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <ImageInput value={img.src} onChange={(src) => setRow(i, { src })} />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, { label: '', src: '' }])}
        className="inline-flex items-center gap-2 rounded-full border border-beam/30 px-4 py-1.5 text-[12.5px] font-semibold text-beam transition-all hover:border-beam/70 hover:bg-beam/10"
      >
        <Plus className="h-3.5 w-3.5" /> Add image
      </button>
      <p className="text-[11.5px] text-muted-foreground/70">The first image is the card / cover shot on the client site.</p>
    </div>
  )
}

export default function ProductForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const toast = useToast()

  const [form, setForm] = useState(isEdit ? null : BLANK)
  const [categories, setCategories] = useState([])
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [slugTouched, setSlugTouched] = useState(isEdit)
  const [slug, setSlug] = useState('')

  useEffect(() => {
    api.categories.list().then(setCategories)
    if (isEdit) {
      api.products.get(id).then((p) => {
        if (!p) {
          toast.error('Not found', 'That product does not exist.')
          navigate('/products')
          return
        }
        setForm(p)
        setSlug(p.slug)
      })
    }
  }, [id, isEdit, navigate, toast])

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))
  const autoSlug = useMemo(() => slugify(form?.name?.replace(/^Radium\s+/i, '') ?? ''), [form?.name])
  const finalSlug = slugTouched ? slug : autoSlug

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required.'
    if (!form.tagline.trim()) e.tagline = 'Tagline is required.'
    if (!finalSlug) e.slug = 'Slug is required.'
    else if (!/^[a-z0-9-]+$/.test(finalSlug)) e.slug = 'Lowercase letters, numbers and dashes only.'
    if (!form.summary.trim()) e.summary = 'Summary is required — it opens the family page.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) {
      toast.error('Check the form', 'Some required fields are missing or invalid.')
      return
    }
    setSaving(true)
    const payload = {
      ...form,
      slug: finalSlug,
      series: form.series.trim() || form.name.replace(/^Radium\s+/i, ''),
      specs: form.specs
        .map((g) => ({ ...g, rows: (g.rows ?? []).filter((r) => r[0] || r[1]) }))
        .filter((g) => g.group?.trim()),
      images: form.images.filter((img) => img.src?.trim()),
      highlights: form.highlights.filter((h) => h.title?.trim() || h.body?.trim()),
    }
    try {
      if (isEdit) {
        await api.products.update(id, payload)
        toast.success('Saved', `${payload.name} updated.`)
      } else {
        await api.products.create({ ...payload, id: finalSlug })
        toast.success('Created', `${payload.name} added to the catalogue.`)
      }
      navigate('/products')
    } catch (err) {
      toast.error('Save failed', err.message)
      setSaving(false)
    }
  }

  if (!form) return <PageLoading />

  return (
    <form onSubmit={onSubmit}>
      <PageHeader
        trail={[{ label: 'Products', to: '/products' }, { label: isEdit ? form.name : 'New product' }]}
        eyebrow="Catalogue"
        title={isEdit ? `Edit — ${form.name}` : 'New product family'}
        actions={
          <>
            <Button variant="ghost" onClick={() => navigate('/products')}>
              Cancel
            </Button>
            <Button as="button" type="submit" loading={saving}>
              <Save className="h-4 w-4" />
              {isEdit ? 'Save changes' : 'Create product'}
            </Button>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_.55fr]">
        <div className="space-y-5">
          {/* Identity */}
          <section className="glass p-6 shadow-card md:p-7">
            <h2 className="t-h3 mb-5 text-foreground">Identity</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" required error={errors.name}>
                <Input value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="Radium Mercury" />
              </Field>
              <Field label="Series" hint="short name">
                <Input value={form.series} onChange={(e) => set({ series: e.target.value })} placeholder="Mercury" />
              </Field>
              <Field label="Slug" required error={errors.slug} hint={isEdit ? 'changing this breaks links' : 'auto-generated'}>
                <Input
                  value={finalSlug}
                  onChange={(e) => {
                    setSlugTouched(true)
                    setSlug(slugify(e.target.value))
                  }}
                  placeholder="mercury"
                  className="font-mono text-[13px]"
                />
              </Field>
              <Field label="Tagline" required error={errors.tagline}>
                <Input value={form.tagline} onChange={(e) => set({ tagline: e.target.value })} placeholder="High performance computers" />
              </Field>
              <Field label="Card note" hint="shown on product cards">
                <Input value={form.note} onChange={(e) => set({ note: e.target.value })} placeholder="For use with PACS & VNA" />
              </Field>
              <Field label="Form factor">
                <Input value={form.formFactor} onChange={(e) => set({ formFactor: e.target.value })} placeholder="1U / 2U rackmount" />
              </Field>
            </div>
            <Field label="Summary" required error={errors.summary} className="mt-5">
              <Textarea rows={4} value={form.summary} onChange={(e) => set({ summary: e.target.value })} placeholder="The paragraph that opens the family page…" />
            </Field>
          </section>

          {/* Highlights */}
          <section className="glass p-6 shadow-card md:p-7">
            <h2 className="t-h3 text-foreground">Highlights</h2>
            <p className="mb-5 mt-1 text-[12.5px] text-muted-foreground">The four feature cards on the family page.</p>
            <RowListEditor
              value={form.highlights}
              onChange={(highlights) => set({ highlights })}
              blank={{ title: '', body: '' }}
              addLabel="Add highlight"
              fields={[
                { key: 'title', placeholder: 'Title' },
                { key: 'body', placeholder: 'Body copy', textarea: true, rows: 2 },
              ]}
            />
          </section>

          {/* Applications */}
          <section className="glass p-6 shadow-card md:p-7">
            <h2 className="t-h3 text-foreground">Applications</h2>
            <p className="mb-5 mt-1 text-[12.5px] text-muted-foreground">Use-case bullets — “PACS application server”, “VNA services”…</p>
            <StringListEditor value={form.applications} onChange={(applications) => set({ applications })} placeholder="Add an application…" />
          </section>

          {/* Specs */}
          <section className="glass p-6 shadow-card md:p-7">
            <h2 className="t-h3 text-foreground">Specification groups</h2>
            <p className="mb-5 mt-1 text-[12.5px] text-muted-foreground">
              Family-specific groups. Shared groups (management, redundancy, environmental, regulatory) are appended automatically by the client.
            </p>
            <SpecsEditor value={form.specs} onChange={(specs) => set({ specs })} />
          </section>
        </div>

        <div className="space-y-5">
          {/* Publish */}
          <section className="glass p-6 shadow-card md:p-7">
            <h2 className="t-h3 mb-5 text-foreground">Publishing</h2>
            <div className="space-y-5">
              <Field label="Category">
                <Select value={form.category} onChange={(e) => set({ category: e.target.value })}>
                  {categories.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Status">
                <Select value={form.status} onChange={(e) => set({ status: e.target.value })}>
                  <option value="available">Available</option>
                  <option value="roadmap">Roadmap / reserved</option>
                </Select>
              </Field>
              <div className="rounded-xl border border-white/[.08] bg-white/[.02] p-4">
                <Toggle
                  checked={form.hasModels}
                  onChange={(hasModels) => set({ hasModels })}
                  label="Has a model table"
                />
                <p className="mt-2 text-[11.5px] leading-relaxed text-muted-foreground/70">
                  Shows the model grid on the family page (Jupiter SS or chassis models).
                </p>
              </div>
            </div>
          </section>

          {/* Gallery */}
          <section className="glass p-6 shadow-card md:p-7">
            <h2 className="t-h3 mb-5 text-foreground">Photography</h2>
            <ImagesEditor value={form.images} onChange={(images) => set({ images })} />
          </section>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={() => navigate('/products')}>
          Cancel
        </Button>
        <Button as="button" type="submit" loading={saving}>
          <Save className="h-4 w-4" />
          {isEdit ? 'Save changes' : 'Create product'}
        </Button>
      </div>
    </form>
  )
}
