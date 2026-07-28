import { cn } from '@/utils'

const TONES = {
  beam: 'border-beam/40 bg-beam/12 text-beam',
  success: 'border-emerald-400/35 bg-emerald-400/10 text-emerald-300',
  muted: 'border-white/12 bg-white/[.04] text-muted-foreground',
  warning: 'border-amber-400/35 bg-amber-400/10 text-amber-300',
  destructive: 'border-destructive/40 bg-destructive/10 text-destructive',
}

export function Badge({ tone = 'muted', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11.5px] font-semibold',
        TONES[tone] ?? TONES.muted,
        className
      )}
    >
      {children}
    </span>
  )
}

/** Maps common status strings to a consistent badge tone. */
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
  const [tone, label] = map[status] ?? ['muted', status ?? '—']
  return <Badge tone={tone}>{label}</Badge>
}
