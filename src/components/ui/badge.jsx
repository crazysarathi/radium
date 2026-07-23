import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[.12em]',
  {
    variants: {
      tone: {
        default: 'border-beam/25 bg-beam/10 text-beam',
        muted: 'border-white/10 bg-white/5 text-muted-foreground',
        warn: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
        good: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
      },
    },
    defaultVariants: { tone: 'default' },
  }
)

export function Badge({ tone = 'default', className, ...props }) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />
}
