import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Badge } from './badge'
import { SplitText } from './split-text'

export function Eyebrow({ children, className }) {
  return (
    <p className={cn('t-eyebrow text-beam/80 flex items-center gap-3', className)}>
      <span className="h-px w-6 bg-beam/50" />
      {children}
    </p>
  )
}

export function Section({ id, className, children, tight = false }) {
  return (
    <section id={id} className={cn(tight ? 'py-14 md:py-20' : 'py-20 md:py-28', className)}>
      <div className="container">{children}</div>
    </section>
  )
}

export function SectionHead({ eyebrow, title, body, align = 'left', className }) {
  return (
    <div className={cn('reveal max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <Eyebrow className={align === 'center' ? 'justify-center' : ''}>{eyebrow}</Eyebrow>}
      <SplitText as="h2" gradient text={title} className="t-h2 mt-4" />
      {body && <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{body}</p>}
    </div>
  )
}

/** Key/value spec rows used on every product page. */
export function SpecTable({ groups, className }) {
  if (!groups?.length) return null
  return (
    <div className={cn('divide-y divide-white/[.06]', className)}>
      {groups.map((g) => (
        <div key={g.group} className="grid gap-4 py-6 md:grid-cols-[200px_1fr]">
          <h4 className="text-[13px] font-bold uppercase tracking-[.16em] text-beam/85">{g.group}</h4>
          <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {g.rows.map(([k, v]) => (
              <div key={k} className="min-w-0">
                <dt className="text-[11px] uppercase tracking-[.14em] text-muted-foreground/85">{k}</dt>
                <dd className="mt-0.5 text-sm text-foreground/90">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  )
}

/** Page-top banner shared by every interior page. */
export function PageHero({ eyebrow, title, body, children, breadcrumb }) {
  return (
    <header className="relative overflow-hidden border-b border-white/[.06] pt-32 pb-14 md:pt-40 md:pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid opacity-70"
        style={{ backgroundSize: '46px 46px', maskImage: 'radial-gradient(70% 60% at 50% 0%, #000 0%, transparent 75%)', WebkitMaskImage: 'radial-gradient(70% 60% at 50% 0%, #000 0%, transparent 75%)' }}
      />
      <div className="container relative">
        {breadcrumb}
        <div className="max-w-3xl">
          {eyebrow && <Eyebrow className="mt-6">{eyebrow}</Eyebrow>}
          <SplitText as="h1" gradient text={title} className="t-hero mt-4" stagger={0.045} />
          {body && <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">{body}</p>}
          {children}
        </div>
      </div>
    </header>
  )
}

export function Breadcrumb({ trail }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[12px] text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-2">
        {trail.map((t, i) => (
          <li key={t.label} className="flex items-center gap-2">
            {i > 0 && <span className="text-white/20">/</span>}
            {t.to ? (
              <Link to={t.to} className="transition-colors hover:text-beam">{t.label}</Link>
            ) : (
              <span className="text-foreground/70">{t.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** PLACEHOLDER page scaffold — used by the pages you will fill in later. */
export function DraftNotice({ children }) {
  return (
    <div className="reveal glass flex flex-wrap items-center gap-3 px-5 py-4 text-[13px] text-muted-foreground">
      <Badge tone="warn">Placeholder</Badge>
      <span>{children}</span>
    </div>
  )
}
