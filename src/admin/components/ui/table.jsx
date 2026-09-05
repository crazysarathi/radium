import * as React from 'react'
import { cn } from '@/admin/utils'

/**
 * shadcn/ui Table primitives, themed with the shared Radium design tokens.
 * DataTable composes these; they are also exported for one-off tables.
 */
export const Table = React.forwardRef(function Table({ className, ...props }, ref) {
  return (
    <div className="relative w-full overflow-x-auto">
      <table ref={ref} className={cn('w-full caption-bottom border-collapse text-left text-sm', className)} {...props} />
    </div>
  )
})

export const TableHeader = React.forwardRef(function TableHeader({ className, ...props }, ref) {
  return <thead ref={ref} className={cn('[&_tr]:border-b [&_tr]:border-black/[.08] dark:[&_tr]:border-white/[.08]', className)} {...props} />
})

export const TableBody = React.forwardRef(function TableBody({ className, ...props }, ref) {
  return <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
})

export const TableFooter = React.forwardRef(function TableFooter({ className, ...props }, ref) {
  return (
    <tfoot
      ref={ref}
      className={cn('border-t border-black/[.08] bg-black/[.02] font-medium dark:border-white/[.08] dark:bg-white/[.02]', className)}
      {...props}
    />
  )
})

export const TableRow = React.forwardRef(function TableRow({ className, ...props }, ref) {
  return (
    <tr
      ref={ref}
      className={cn(
        'border-b border-black/[.06] transition-colors hover:bg-beam/[.045] data-[state=selected]:bg-beam/10 dark:border-white/[.05]',
        className
      )}
      {...props}
    />
  )
})

export const TableHead = React.forwardRef(function TableHead({ className, ...props }, ref) {
  return (
    <th
      ref={ref}
      className={cn(
        'h-12 whitespace-nowrap px-5 text-left align-middle text-[11px] font-semibold uppercase tracking-[1.8px] text-beam/70',
        className
      )}
      {...props}
    />
  )
})

export const TableCell = React.forwardRef(function TableCell({ className, ...props }, ref) {
  return <td ref={ref} className={cn('px-5 py-4 align-middle text-[13.5px] text-foreground/90', className)} {...props} />
})

export const TableCaption = React.forwardRef(function TableCaption({ className, ...props }, ref) {
  return <caption ref={ref} className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
})
