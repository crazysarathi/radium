import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Box, HardDrive, Server, Package, Tags,
  GalleryHorizontalEnd, Layers, FileText, Building2, Phone,
  Menu as MenuIcon, PanelBottom, Globe, Image as ImageIcon, Inbox,
  LogOut, ExternalLink, X,
} from 'lucide-react'
import { cn } from '@/utils'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/services'

const NAV = [
  {
    group: 'Overview',
    items: [{ to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    group: 'Catalogue',
    items: [
      { to: '/products', label: 'Products', icon: Box },
      { to: '/models', label: 'Jupiter Models', icon: HardDrive },
      { to: '/chassis', label: 'Chassis Models', icon: Server },
      { to: '/accessories', label: 'Accessories', icon: Package },
      { to: '/categories', label: 'Categories', icon: Tags },
    ],
  },
  {
    group: 'Content',
    items: [
      { to: '/hero', label: 'Hero Slides', icon: GalleryHorizontalEnd },
      { to: '/solutions', label: 'Solutions', icon: Layers },
      { to: '/resources', label: 'Resources', icon: FileText },
      { to: '/content/company', label: 'Company Page', icon: Building2 },
      { to: '/content/contact', label: 'Contact Page', icon: Phone },
    ],
  },
  {
    group: 'Site',
    items: [
      { to: '/site/navigation', label: 'Navigation', icon: MenuIcon },
      { to: '/site/footer', label: 'Footer', icon: PanelBottom },
      { to: '/site/seo', label: 'SEO', icon: Globe },
      { to: '/media', label: 'Media Library', icon: ImageIcon },
    ],
  },
  {
    group: 'Inbox',
    items: [{ to: '/enquiries', label: 'Enquiries', icon: Inbox, badge: 'newEnquiries' }],
  },
]

function SidebarLink({ item, badges, onNavigate }) {
  const badge = item.badge ? badges[item.badge] : 0
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-3 rounded-xl border border-transparent px-3.5 py-2.5 text-[13.5px] font-medium transition-all',
          isActive
            ? 'border-beam/40 bg-beam/12 text-beam shadow-glow'
            : 'text-muted-foreground hover:bg-white/[.04] hover:text-foreground'
        )
      }
    >
      <item.icon className="h-4 w-4 shrink-0" />
      <span className="flex-1">{item.label}</span>
      {badge > 0 ? (
        <span className="rounded-full bg-accent-grad px-2 py-0.5 font-mono text-[10.5px] font-bold text-[#26060a]">
          {badge}
        </span>
      ) : null}
    </NavLink>
  )
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [badges, setBadges] = useState({ newEnquiries: 0 })

  // Unread-enquiry badge — refreshed on every route change so actions taken
  // in the inbox are reflected immediately.
  useEffect(() => {
    let alive = true
    api.enquiries.list().then((items) => {
      if (alive) setBadges({ newEnquiries: items.filter((e) => e.status === 'new').length })
    })
    return () => {
      alive = false
    }
  }, [location.pathname])

  useEffect(() => setMobileOpen(false), [location.pathname])

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 pb-6 pt-6">
        <NavLink to="/" className="flex items-center gap-3">
          <img src="/radium-logo-dark.svg" alt="Radium" className="h-8 w-auto" />
          <span className="rounded-md border border-beam/30 bg-beam/10 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-beam">
            Admin
          </span>
        </NavLink>
        <button
          type="button"
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
        {NAV.map((section) => (
          <div key={section.group}>
            <p className="t-eyebrow mb-2 px-3.5 text-[10px] text-beam/60">{section.group}</p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <SidebarLink key={item.to} item={item} badges={badges} onNavigate={() => setMobileOpen(false)} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/[.07] p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/[.03] p-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-grad font-mono text-[12px] font-bold text-[#26060a]">
            {user?.initials ?? 'RA'}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-foreground">{user?.name}</p>
            <p className="truncate text-[11px] text-muted-foreground">{user?.role}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen lg:pl-[264px]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] border-r border-white/[.07] bg-[rgba(18,4,6,.72)] backdrop-blur-[14px] lg:block">
        {sidebar}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-[#0a0305]/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[280px] animate-dropdown-in border-r border-white/[.07] bg-[#160507] shadow-card">
            {sidebar}
          </aside>
        </div>
      ) : null}

      {/* Topbar */}
      <header className="sticky top-0 z-30 border-b border-white/[.07] bg-[rgba(18,4,6,.72)] backdrop-blur-[14px]">
        <div className="flex h-16 items-center gap-4 px-5 md:px-8">
          <button
            type="button"
            className="rounded-lg p-2 text-muted-foreground hover:bg-white/5 hover:text-foreground lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
          <p className="hidden text-[13px] text-muted-foreground sm:block">
            Content console · <span className="text-foreground/80">mock data — changes stay in this browser</span>
          </p>
          <div className="ml-auto flex items-center gap-2">
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-[12.5px] font-semibold text-muted-foreground transition-all hover:border-beam/40 hover:text-foreground"
            >
              View site
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </header>

      <main className="px-5 py-8 md:px-8 lg:py-10">
        <div className="mx-auto w-full max-w-[1180px] animate-fade-up">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
