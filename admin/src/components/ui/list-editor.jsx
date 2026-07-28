import { useState } from 'react'
import { Plus, X, GripVertical, ArrowUp, ArrowDown, Trash2 } from 'lucide-react'
import { cn } from '@/utils'
import { Input } from './field'

/**
 * Editor for a list of plain strings (chips, bullets, applications, stack
 * lines). Add via the inline input, remove per chip.
 */
export function StringListEditor({ value = [], onChange, placeholder = 'Add an item…', max }) {
  const [draft, setDraft] = useState('')

  const add = () => {
    const v = draft.trim()
    if (!v || value.includes(v)) return
    if (max && value.length >= max) return
    onChange([...value, v])
    setDraft('')
  }

  return (
    <div>
      {value.length > 0 && (
        <ul className="mb-2.5 flex flex-wrap gap-2">
          {value.map((item, i) => (
            <li
              key={`${item}-${i}`}
              className="flex items-center gap-2 rounded-full border border-beam/25 bg-beam/[.07] py-1 pl-3.5 pr-1.5 text-[12.5px] text-foreground/90"
            >
              {item}
              <button
                type="button"
                onClick={() => onChange(value.filter((_, j) => j !== i))}
                className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                aria-label={`Remove ${item}`}
              >
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add()
            }
          }}
          placeholder={placeholder}
          disabled={Boolean(max) && value.length >= max}
        />
        <button
          type="button"
          onClick={add}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-beam/30 text-beam transition-all hover:border-beam/70 hover:bg-beam/10"
          aria-label="Add"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {max ? <p className="mt-1.5 text-[11px] text-muted-foreground/70">{value.length}/{max}</p> : null}
    </div>
  )
}

/**
 * Editor for a list of objects rendered as rows — `fields` describes the
 * inputs per row, rows can be reordered and removed. Used for highlights,
 * spec rows, timeline entries, links, CTAs…
 */
export function RowListEditor({ value = [], onChange, fields, addLabel = 'Add row', blank, reorder = true }) {
  const setRow = (i, patch) => {
    const next = value.slice()
    next[i] = { ...next[i], ...patch }
    onChange(next)
  }
  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= value.length) return
    const next = value.slice()
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div className="space-y-2.5">
      {value.map((row, i) => (
        <div key={i} className="flex items-start gap-2 rounded-xl border border-white/[.08] bg-white/[.02] p-2.5">
          {reorder ? (
            <div className="flex shrink-0 flex-col items-center gap-0.5 pt-1.5 text-muted-foreground/50">
              <GripVertical className="h-3.5 w-3.5" />
            </div>
          ) : null}
          <div className={cn('grid flex-1 gap-2', fields.length > 1 && 'sm:grid-cols-[repeat(var(--cols),1fr)]')} style={{ '--cols': fields.length }}>
            {fields.map((f) =>
              f.textarea ? (
                <textarea
                  key={f.key}
                  rows={f.rows ?? 2}
                  value={row[f.key] ?? ''}
                  onChange={(e) => setRow(i, { [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  className={cn('field-input leading-relaxed', f.className)}
                />
              ) : (
                <input
                  key={f.key}
                  value={row[f.key] ?? ''}
                  onChange={(e) => setRow(i, { [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  className={cn('field-input', f.className)}
                />
              )
            )}
          </div>
          <div className="flex shrink-0 flex-col gap-1 pt-0.5">
            {reorder ? (
              <>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground disabled:opacity-25" aria-label="Move up">
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground disabled:opacity-25" aria-label="Move down">
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </>
            ) : null}
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive" aria-label="Remove row">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, { ...blank }])}
        className="inline-flex items-center gap-2 rounded-full border border-beam/30 px-4 py-1.5 text-[12.5px] font-semibold text-beam transition-all hover:border-beam/70 hover:bg-beam/10"
      >
        <Plus className="h-3.5 w-3.5" />
        {addLabel}
      </button>
    </div>
  )
}
