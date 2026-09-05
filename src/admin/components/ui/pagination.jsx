import * as React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/admin/utils'

/* ------------------------------------------------------------------ */
/* shadcn/ui Pagination primitives, themed with the Radium tokens.     */
/* ------------------------------------------------------------------ */

export function PaginationRoot({ className, ...props }) {
  return <nav role="navigation" aria-label="pagination" className={cn('mx-auto flex w-full justify-center', className)} {...props} />
}

export const PaginationContent = React.forwardRef(function PaginationContent({ className, ...props }, ref) {
  return <ul ref={ref} className={cn('flex flex-row items-center gap-1.5', className)} {...props} />
})

export const PaginationItem = React.forwardRef(function PaginationItem({ className, ...props }, ref) {
  return <li ref={ref} className={cn('list-none', className)} {...props} />
})

export function PaginationLink({ className, isActive, size = 'icon', ...props }) {
  return (
    <button
      type="button"
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex h-8 items-center justify-center rounded-lg border text-[12.5px] font-semibold transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-beam/40',
        'disabled:pointer-events-none disabled:opacity-35',
        size === 'icon' ? 'min-w-8 px-2' : 'gap-1 px-2.5',
        isActive
          ? 'border-beam/60 bg-beam/15 text-beam shadow-glow'
          : 'border-black/10 text-muted-foreground hover:border-beam/30 hover:text-foreground dark:border-white/10',
        className
      )}
      {...props}
    />
  )
}

export function PaginationPrevious({ className, ...props }) {
  return (
    <PaginationLink aria-label="Go to previous page" size="default" className={cn('pl-2', className)} {...props}>
      <ChevronLeft className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Previous</span>
    </PaginationLink>
  )
}

export function PaginationNext({ className, ...props }) {
  return (
    <PaginationLink aria-label="Go to next page" size="default" className={cn('pr-2', className)} {...props}>
      <span className="hidden sm:inline">Next</span>
      <ChevronRight className="h-3.5 w-3.5" />
    </PaginationLink>
  )
}

export function PaginationEllipsis({ className, ...props }) {
  return (
    <span aria-hidden className={cn('flex h-8 w-6 items-center justify-center text-muted-foreground', className)} {...props}>
      <MoreHorizontal className="h-3.5 w-3.5" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* App-level pagination bar used by the list pages.                    */
/* ------------------------------------------------------------------ */

export function Pagination({ page, pages, total, onPage }) {
  if (pages <= 1) return null

  const nums = []
  for (let i = 1; i <= pages; i += 1) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i)
    else if (nums[nums.length - 1] !== '…') nums.push('…')
  }

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
      <p className="text-[12.5px] text-muted-foreground">
        {total} {total === 1 ? 'entry' : 'entries'}
      </p>
      <PaginationRoot className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious disabled={page === 1} onClick={() => onPage(page - 1)} />
          </PaginationItem>
          {nums.map((n, i) => (
            <PaginationItem key={n === '…' ? `gap-${i}` : n}>
              {n === '…' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink isActive={n === page} onClick={() => onPage(n)}>
                  {n}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext disabled={page === pages} onClick={() => onPage(page + 1)} />
          </PaginationItem>
        </PaginationContent>
      </PaginationRoot>
    </div>
  )
}
