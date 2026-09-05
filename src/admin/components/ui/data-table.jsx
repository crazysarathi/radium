import { cn } from '@/admin/utils'
import { Skeleton } from './skeleton'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './table'

const ALIGN = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

/**
 * App-level table built on the shadcn Table primitives.
 * columns = [{ key, label, render?, className?, headClassName?, width?, align? }]
 * `align` ('left' | 'center' | 'right') is applied to the header AND its cells,
 * so columns stay lined up. Loading skeleton handled here; empty state is the
 * caller's `empty` slot.
 */
export function DataTable({ columns, rows, loading, rowKey = 'id', onRowClick, empty }) {
  if (!loading && (!rows || rows.length === 0)) return empty ?? null

  return (
    <div className="glass overflow-hidden shadow-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-black/[.02] hover:bg-transparent dark:bg-white/[.02]">
            {columns.map((c) => (
              <TableHead
                key={c.key}
                style={c.width ? { width: c.width } : undefined}
                className={cn(ALIGN[c.align] ?? ALIGN.left, c.headClassName)}
              >
                {c.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  {columns.map((c) => (
                    <TableCell key={c.key}>
                      <Skeleton className="h-4 w-full max-w-[140px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : rows.map((row) => (
                <TableRow
                  key={row[rowKey]}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(onRowClick && 'cursor-pointer')}
                >
                  {columns.map((c) => (
                    <TableCell key={c.key} className={cn(ALIGN[c.align] ?? ALIGN.left, c.className)}>
                      {c.render ? c.render(row) : row[c.key] ?? '—'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  )
}
