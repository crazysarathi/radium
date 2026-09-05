import { cva } from 'class-variance-authority'
import { cn } from '@/admin/utils'

/** shadcn/ui Badge pattern — cva variants over the shared Radium tones. */
export const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11.5px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-beam/40',
  {
    variants: {
      variant: {
        beam: 'border-beam/40 bg-beam/12 text-beam',
        success: 'border-emerald-400/35 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300',
        muted: 'border-black/[.12] bg-black/[.04] text-muted-foreground dark:border-white/12 dark:bg-white/[.04]',
        warning: 'border-amber-400/35 bg-amber-400/10 text-amber-700 dark:text-amber-300',
        destructive: 'border-destructive/40 bg-destructive/10 text-destructive',
      },
    },
    defaultVariants: { variant: 'muted' },
  }
)

/** `variant` is the shadcn prop; `tone` stays as an alias for older call sites. */
export function Badge({ variant, tone, className, ...props }) {
  return <span className={cn(badgeVariants({ variant: variant ?? tone }), className)} {...props} />
}

/** Maps common status strings to a consistent badge variant. */
export function StatusBadge({ status }) {
  const map = {
    available: ['success', 'Available'],
    roadmap: ['warning', 'Roadmap'],
    published: ['success', 'Published'],
    draft: ['muted', 'Draft'],
    new: ['beam', 'New'],
    replied: ['warning', 'Replied'],
    closed: ['muted', 'Closed'],
  }
  const [variant, label] = map[status] ?? ['muted', status ?? '—']
  return <Badge variant={variant}>{label}</Badge>
}
