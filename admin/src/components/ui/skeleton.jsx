import { cn } from '@/utils'

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse rounded-lg bg-white/[.06]', className)} />
}

export function Spinner({ className }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('h-7 w-7 animate-spin rounded-full border-2 border-beam/25 border-t-beam', className)}
    />
  )
}

/** Full-panel loading placeholder for editor pages. */
export function PageLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner />
    </div>
  )
}
