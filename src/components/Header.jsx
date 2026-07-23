import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, X, Search, ArrowRight } from 'lucide-react'
import { nav } from '@/data/site'
import { cn } from '@/lib/utils'
import { Button } from './ui'

function MegaPanel({ columns, onNavigate }) {
  return (
    <div className="grid gap-x-8 gap-y-6 p-6 sm:grid-cols-2 lg:grid-cols-5">
      {columns.map((col) => (
        <div key={col.heading}>
          <h4 className="t-eyebrow mb-3 text-beam/70">{col.heading}</h4>
          <ul className="space-y-1">
            {col.items.map((it) => (
              <li key={it.label}>
                <Link
                  to={it.to}
                  onClick={onNavigate}
                  className="group/i block rounded-lg px-3 py-2 transition-colors hover:bg-beam/10"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-foreground/90 group-hover/i:text-beam">
                    {it.label}
                    {it.status === 'roadmap' && (
                      <span className="rounded-full border border-white/10 px-1.5 py-px text-[9px] uppercase tracking-widest text-muted-foreground">
                        Roadmap
                      </span>
                    )}
                  </span>
                  {it.blurb && <span className="mt-0.5 block text-[12px] text-muted-foreground">{it.blurb}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="sm:col-span-2 lg:col-span-4">
        <div className="hairline mb-4" />
        <Link
          to="/certified-pre-owned"
          onClick={onNavigate}
          className="group/c flex items-center justify-between gap-4 rounded-xl border border-beam/20 bg-beam/[.06] px-4 py-3 transition-colors hover:border-beam/50"
        >
          <span className="text-sm">
            <strong className="font-semibold text-foreground">Certified Pre-Owned</strong>
            <span className="ml-2 text-muted-foreground">Refurbished Radium hardware, burned in and warrantied</span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-beam transition-transform group-hover/c:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [openMega, setOpenMega] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeTimer = useRef(null)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setOpenMega(null)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && (setOpenMega(null), setMobileOpen(false))
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const hoverOpen = (label) => {
    clearTimeout(closeTimer.current)
    setOpenMega(label)
  }
  const hoverClose = () => {
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpenMega(null), 140)
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-beam focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink-900"
      >
        Skip to content
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled || openMega
            ? 'border-b border-white/[.07] bg-[#0c0304]/85 backdrop-blur-xl'
            : 'border-b border-transparent'
        )}
      >
        <div className="container flex h-[72px] items-center justify-between gap-6">
          <Link to="/" className="shrink-0" aria-label="Radium — home">
            <img src="/radium-logo-dark.svg" alt="Radium" className="h-9 w-auto md:h-10" width="220" height="70" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {nav.map((item) =>
              item.mega ? (
                <div key={item.label} onMouseEnter={() => hoverOpen(item.label)} onMouseLeave={hoverClose}>
                  <button
                    type="button"
                    aria-expanded={openMega === item.label}
                    onClick={() => setOpenMega((o) => (o === item.label ? null : item.label))}
                    className={cn(
                      'flex items-center gap-1 rounded-full px-3.5 py-2 text-[13.5px] font-semibold transition-colors',
                      openMega === item.label || pathname.startsWith(item.to)
                        ? 'text-beam'
                        : 'text-foreground/75 hover:text-foreground'
                    )}
                  >
                    {item.label}
                    <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', openMega === item.label && 'rotate-180')} />
                  </button>
                </div>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.to}
                  onMouseEnter={hoverClose}
                  className={({ isActive }) =>
                    cn(
                      'rounded-full px-3.5 py-2 text-[13.5px] font-semibold transition-colors',
                      isActive ? 'text-beam' : 'text-foreground/75 hover:text-foreground'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/resources"
              aria-label="Search resources"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition-colors hover:border-beam/40 hover:text-beam md:inline-flex"
            >
              <Search className="h-4 w-4" />
            </Link>
            <Button to="/contact" size="sm" className="hidden sm:inline-flex">
              Request a quote
            </Button>
            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((o) => !o)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-foreground lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Desktop mega menu */}
        {nav.map(
          (item) =>
            item.mega &&
            openMega === item.label && (
              <div
                key={item.label}
                onMouseEnter={() => hoverOpen(item.label)}
                onMouseLeave={hoverClose}
                className="absolute inset-x-0 top-[72px] hidden lg:block"
              >
                <div className="container">
                  <div className="relative origin-top animate-dropdown-in overflow-hidden rounded-glass border border-white/[.08] bg-[#120406]/95 shadow-[0_40px_90px_-24px_rgba(0,0,0,.9)] backdrop-blur-2xl">
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-beam/50 to-transparent"
                    />
                    <MegaPanel columns={item.mega} onNavigate={() => setOpenMega(null)} />
                  </div>
                </div>
              </div>
            )
        )}
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-[#0a0305]/97 pt-[72px] backdrop-blur-xl lg:hidden">
          <nav className="container py-6" aria-label="Mobile">
            {nav.map((item) => (
              <div key={item.label} className="border-b border-white/[.07] py-4">
                <Link to={item.to} className="block text-lg font-bold text-foreground">
                  {item.label}
                </Link>
                {item.mega && (
                  <div className="mt-3 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                    {item.mega.map((col) => (
                      <div key={col.heading}>
                        <h4 className="t-eyebrow mb-2 text-beam/60">{col.heading}</h4>
                        <ul className="space-y-1.5">
                          {col.items.map((it) => (
                            <li key={it.label}>
                              <Link to={it.to} className="text-sm text-muted-foreground hover:text-beam">
                                {it.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Button to="/contact" className="mt-6 w-full" size="lg">
              Request a quote
            </Button>
          </nav>
        </div>
      )}
    </>
  )
}
