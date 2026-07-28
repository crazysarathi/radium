import { PackageOpen } from 'lucide-react'

export function EmptyState({ icon: Icon = PackageOpen, title, body, action }) {
  return (
    <div className="glass flex flex-col items-center justify-center px-8 py-16 text-center shadow-card">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-beam/25 bg-beam/10">
        <Icon className="h-6 w-6 text-beam" />
      </span>
      <h3 className="t-h3 mt-5 text-foreground">{title}</h3>
      {body ? <p className="mt-2 max-w-sm text-[13.5px] leading-relaxed text-muted-foreground">{body}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
