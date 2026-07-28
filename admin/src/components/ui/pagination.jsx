import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils'

export function Pagination({ page, pages, total, onPage }) {
  if (pages <= 1) return null
  const nums = []
  for (let i = 1; i <= pages; i += 1) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i)
    else if (nums[nums.length - 1] !== '…') nums.push('…')
  }

  const btn =
    'flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-[12.5px] font-semibold transition-all'

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
      <p className="text-[12.5px] text-muted-foreground">
        {total} {total === 1 ? 'entry' : 'entries'}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPage(page - 1)}
          className={cn(btn, 'border-white/10 text-muted-foreground hover:border-beam/30 hover:text-foreground disabled:opacity-35')}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        {nums.map((n, i) =>
          n === '…' ? (
            <span key={`gap-${i}`} className="px-1 text-[12px] text-muted-foreground">
              …
            </span>
          ) : (
            <button
              key={n}
              type="button"
              onClick={() => onPage(n)}
              className={cn(
                btn,
                n === page
                  ? 'border-beam/60 bg-beam/15 text-beam shadow-glow'
                  : 'border-white/10 text-muted-foreground hover:border-beam/30 hover:text-foreground'
              )}
            >
              {n}
            </button>
          )
        )}
        <button
          type="button"
          disabled={page === pages}
          onClick={() => onPage(page + 1)}
          className={cn(btn, 'border-white/10 text-muted-foreground hover:border-beam/30 hover:text-foreground disabled:opacity-35')}
          aria-label="Next page"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
