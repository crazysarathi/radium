import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Search, ShoppingCart, ChevronDown } from 'lucide-react'
import { navLinks } from '@/data/site'
import { CATEGORY_ORDER } from '@/lib/catalogue'
import { useCatalogue } from '@/context/CatalogueContext'
import { cn } from '@/lib/utils'
import { Button } from './ui'
import { ProductImage } from './ProductGallery'
import { useEnquiry } from './enquiry/EnquiryContext'
import SearchPalette from './SearchPalette'

export default function Header() {
  const enquiry = useEnquiry()
  const catalogue = useCatalogue()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState(null)
  const closeTimer = useRef(null)
  const { pathname, search } = useLocation()

  // Hover-intent dropdown control. Opening is immediate; closing waits a beat
  // so the cursor can cross the gap between trigger and panel (or drift out
  // and back) without the menu flickering shut. CSS :hover alone can't do
  // this — during its fade-out the panel still captures the pointer and
  // re-opens itself.
  const openDropdown = (key) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setOpenMenu(key)
  }
  const closeDropdown = (immediate = false) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    if (immediate) {
      closeTimer.current = null
      setOpenMenu(null)
    } else {
      closeTimer.current = setTimeout(() => setOpenMenu(null), 160)
    }
  }
  useEffect(() => () => clearTimeout(closeTimer.current), [])

  const products = catalogue?.products ?? []
  const categories = catalogue?.categories ?? []

  // Top-level nav is the five catalogue categories (in the curated compute →
  // storage → chassis → workstation → edge order) plus the static links from
  // data/site.js. Each category deep-links into the products index with its
  // filter pre-set via ?category=<key>. While the catalogue is still loading
  // the list is simply empty and the static links render alone — the header
  // sits outside <CatalogueGate>, so it must never assume data.
  const categoryNav = useMemo(
    () =>
      CATEGORY_ORDER.map((key) => categories.find((c) => c.key === key))
        .filter(Boolean)
        .map((c) => ({ label: c.label, blurb: c.blurb, to: `/products?category=${c.key}`, category: c.key })),
    [categories]
  )

  // Which category link is "current": the filtered products index, or a
  // family/model page whose product belongs to that category.
  const activeCategory = useMemo(() => {
    if (pathname === '/products') return new URLSearchParams(search).get('category')
    if (pathname.startsWith('/products/')) {
      const slug = pathname.split('/')[2]
      return products.find((p) => p.slug === slug)?.category ?? null
    }
    return null
  }, [pathname, search, products])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // `search` is a dependency because the category links only change the query
  // string once the user is already on /products.
  useEffect(() => {
    setMobileOpen(false)
    setSearchOpen(false)
    setOpenMenu(null)
  }, [pathname, search])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMobileOpen(false)
        setSearchOpen(false)
        setOpenMenu(null)
      } else if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

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
          scrolled
            ? 'border-b border-white/[.07] bg-[#0c0304]/85 backdrop-blur-xl'
            : 'border-b border-transparent'
        )}
      >
        <div className="container flex h-[72px] items-center justify-between gap-6">
          <Link to="/" className="shrink-0" aria-label="Radium — home">
            <img src="/radium-logo.svg" alt="Radium" className="h-15 w-auto md:h-12" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  'rounded-full px-3.5 py-2 text-[13.5px] font-semibold transition-colors',
                  isActive ? 'text-beam' : 'text-foreground/75 hover:text-foreground'
                )
              }
            >
              Overview
            </NavLink>
            {categoryNav.map((item) => {
              const items = products.filter((p) => p.category === item.category)
              const open = openMenu === item.category
              return (
                <div
                  key={item.category}
                  className="relative"
                  onMouseEnter={() => items.length > 0 && openDropdown(item.category)}
                  onMouseLeave={() => items.length > 0 && closeDropdown()}
                  onFocus={() => items.length > 0 && openDropdown(item.category)}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) closeDropdown(true)
                  }}
                >
                  <Link
                    to={item.to}
                    aria-current={activeCategory === item.category ? 'page' : undefined}
                    aria-haspopup={items.length > 0 ? 'menu' : undefined}
                    aria-expanded={items.length > 0 ? open : undefined}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[13.5px] font-semibold transition-colors',
                      activeCategory === item.category ? 'text-beam' : 'text-foreground/75 hover:text-foreground',
                      open && 'text-foreground'
                    )}
                  >
                    {item.label}
                    {items.length > 0 && (
                      <ChevronDown
                        className={cn(
                          'h-3.5 w-3.5 opacity-60 transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)]',
                          open && 'rotate-180 opacity-100'
                        )}
                      />
                    )}
                  </Link>

                  {/* Hover dropdown — this category's products. Open/close is
                      state-driven (see openDropdown/closeDropdown) so leaving
                      the trigger closes it after a short grace period instead
                      of the panel re-capturing the pointer mid-fade. The pt-3
                      keeps hover unbroken while the cursor travels down. */}
                  {items.length > 0 && (
                    <div
                      className={cn(
                        'absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3',
                        !open && 'pointer-events-none'
                      )}
                    >
                      <div
                        className={cn(
                          'w-[380px] origin-top overflow-hidden rounded-2xl border border-beam/15 bg-[#0c0304]/95 shadow-[0_24px_70px_-16px_rgba(0,0,0,.75),0_0_44px_-20px_rgba(255,77,94,.4)] backdrop-blur-xl',
                          open
                            ? 'visible translate-y-0 scale-100 opacity-100 transition-[opacity,transform] duration-300 ease-[cubic-bezier(.16,1,.3,1)]'
                            : 'invisible -translate-y-2 scale-[.97] opacity-0 transition-[opacity,transform,visibility] duration-150 ease-in'
                        )}
                      >
                        <div
                          aria-hidden
                          className="h-px w-full"
                          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,77,94,.55), transparent)' }}
                        />
                        {item.blurb && (
                          <p className="border-b border-white/[.06] px-4 pb-3 pt-3.5 text-[12px] leading-relaxed text-muted-foreground">
                            {item.blurb}
                          </p>
                        )}
                        <div className="p-2">
                          {items.map((p, i) => (
                            <Link
                              key={p.slug}
                              to={`/products/${p.slug}`}
                              style={
                                open
                                  ? { animation: `nav-item-in .35s cubic-bezier(.16,1,.3,1) ${60 + i * 35}ms both` }
                                  : undefined
                              }
                              className="group/item flex items-center gap-3.5 rounded-xl p-2 transition-colors hover:bg-beam/10"
                            >
                              <ProductImage product={p} className="h-12 w-[68px] shrink-0 rounded-lg" />
                              <span className="min-w-0">
                                <span className="flex items-center gap-2 text-[13.5px] font-semibold text-foreground transition-colors group-hover/item:text-beam">
                                  <span className="truncate">{p.name}</span>
                                  {p.status !== 'available' && (
                                    <span className="shrink-0 rounded-full border border-white/15 px-1.5 py-px text-[9.5px] font-bold uppercase tracking-wide text-muted-foreground">
                                      Roadmap
                                    </span>
                                  )}
                                </span>
                                <span className="mt-0.5 block truncate text-[12px] text-muted-foreground">
                                  {p.tagline}
                                </span>
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            {navLinks.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-3.5 py-2 text-[13.5px] font-semibold transition-colors',
                    isActive ? 'text-beam' : 'text-foreground/75 hover:text-foreground'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Search products"
              onClick={() => setSearchOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition-colors hover:border-beam/40 hover:text-beam"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label={`Enquiry list (${enquiry?.count ?? 0} items)`}
              onClick={() => enquiry?.openDrawer()}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition-colors hover:border-beam/40 hover:text-beam"
            >
              <ShoppingCart className="h-4 w-4" />
              {(enquiry?.count ?? 0) > 0 && (
                <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-beam px-1 text-[10px] font-bold text-[#160607]">
                  {enquiry.count}
                </span>
              )}
            </button>
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
      </header>

      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile drawer — same items as the desktop nav */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 overflow-y-auto bg-[#0a0305]/97 pt-[72px] backdrop-blur-xl lg:hidden">
          <nav className="container py-6" aria-label="Mobile">
            <div className="border-b border-white/[.07] py-4">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="block text-lg font-bold text-foreground"
              >
                Overview
              </Link>
            </div>
            {categoryNav.map((item) => {
              const items = products.filter((p) => p.category === item.category)
              return (
                <div key={item.label} className="border-b border-white/[.07] py-4">
                  <Link
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className="block text-lg font-bold text-foreground"
                  >
                    {item.label}
                  </Link>
                  {items.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {items.map((p) => (
                        <li key={p.slug}>
                          <Link
                            to={`/products/${p.slug}`}
                            onClick={() => setMobileOpen(false)}
                            className="block rounded-lg py-1.5 pl-4 text-[14px] text-muted-foreground transition-colors hover:text-beam"
                          >
                            {p.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
            {navLinks.map((item) => (
              <div key={item.label} className="border-b border-white/[.07] py-4">
                <Link
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="block text-lg font-bold text-foreground"
                >
                  {item.label}
                </Link>
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
