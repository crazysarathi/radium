import { Search } from 'lucide-react'
import { cn } from '@/admin/utils'
import { Tabs, TabsList, TabsTrigger } from './tabs'

export function SearchInput({ value, onChange, placeholder = 'Search…', className }) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="field-input h-10 py-0 pl-10"
      />
    </div>
  )
}

/**
 * Filter row built on the shadcn Tabs primitives — one tab per category,
 * mirroring the pill chips on the client's home page. Same API as before:
 * options = [{ value, label, icon?, count? }].
 */
export function FilterChips({ options, value, onChange, className }) {
  return (
    <Tabs value={value ?? 'all'} onValueChange={onChange} className={className}>
      <TabsList>
        {options.map((o) => (
          <TabsTrigger key={o.value} value={o.value}>
            {o.icon ? <o.icon className="h-3.5 w-3.5" /> : null}
            {o.label}
            {typeof o.count === 'number' ? <span className="font-mono text-[11px] opacity-70">{o.count}</span> : null}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

/** Standard list toolbar: search on the left, filters/extras on the right. */
export function Toolbar({ children, className }) {
  return <div className={cn('mb-5 flex flex-wrap items-center justify-between gap-3', className)}>{children}</div>
}
