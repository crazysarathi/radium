import { Search } from 'lucide-react'
import { cn } from '@/utils'

export function SearchInput({ value, onChange, placeholder = 'Search…', className }) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="field-input pl-10"
      />
    </div>
  )
}

/** Pill filter row — mirrors the category chips on the client's home page. */
export function FilterChips({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-all',
            value === o.value || (!value && o.value === 'all')
              ? 'border-beam/60 bg-beam/15 text-beam shadow-glow'
              : 'border-white/10 text-muted-foreground hover:border-beam/30 hover:text-foreground'
          )}
        >
          {o.icon ? <o.icon className="h-3.5 w-3.5" /> : null}
          {o.label}
          {typeof o.count === 'number' ? <span className="font-mono text-[11px] opacity-70">{o.count}</span> : null}
        </button>
      ))}
    </div>
  )
}

/** Standard list toolbar: search on the left, filters/extras on the right. */
export function Toolbar({ children, className }) {
  return <div className={cn('mb-5 flex flex-wrap items-center gap-3', className)}>{children}</div>
}
