import { cn } from '@/utils'
import { Skeleton } from './skeleton'

/**
 * Generic table: columns = [{ key, label, render?, className?, width? }].
 * Handles the loading skeleton; empty state is the caller's `empty` slot.
 */
export function DataTable({ columns, rows, loading, rowKey = 'id', onRowClick, empty }) {
  if (!loading && (!rows || rows.length === 0)) return empty ?? null

  return (
    <div className="glass overflow-hidden shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/[.08] bg-white/[.02]">
              {columns.map((c) => (
                <th
                  key={c.key}
                  style={c.width ? { width: c.width } : undefined}
                  className={cn('t-eyebrow whitespace-nowrap px-5 py-3.5 text-[10.5px] text-beam/70', c.className)}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/[.05]">
                    {columns.map((c) => (
                      <td key={c.key} className="px-5 py-4">
                        <Skeleton className="h-4 w-full max-w-[140px]" />
                      </td>
                    ))}
                  </tr>
                ))
              : rows.map((row) => (
                  <tr
                    key={row[rowKey]}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn(
                      'border-b border-white/[.05] transition-colors last:border-0 hover:bg-beam/[.045]',
                      onRowClick && 'cursor-pointer'
                    )}
                  >
                    {columns.map((c) => (
                      <td key={c.key} className={cn('px-5 py-4 text-[13.5px] text-foreground/90', c.className)}>
                        {c.render ? c.render(row) : row[c.key] ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
