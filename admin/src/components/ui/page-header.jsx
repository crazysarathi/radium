import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

/** Page title block — eyebrow + heading + actions, same roles as the client. */
export function PageHeader({ eyebrow, title, body, trail, actions }) {
  return (
    <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {trail?.length ? (
          <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center gap-1.5 text-[12px] text-muted-foreground">
            {trail.map((t, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3 w-3 opacity-50" />}
                {t.to ? (
                  <Link to={t.to} className="transition-colors hover:text-beam">
                    {t.label}
                  </Link>
                ) : (
                  <span className="text-foreground/70">{t.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}
        {eyebrow ? <p className="t-eyebrow text-beam/70">{eyebrow}</p> : null}
        <h1 className="t-h2 mt-2 text-foreground">{title}</h1>
        {body ? <p className="mt-2.5 max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">{body}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  )
}
