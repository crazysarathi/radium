import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Box, Package, Shapes, Layers, Inbox, HistoryIcon, Menu as MenuIcon,
  LayoutDashboard, LogOut, ExternalLink, X, Sun, Moon, Users,
} from 'lucide-react'
import { cn } from '@/admin/utils'
import { useAuth } from '@/admin/context/AuthContext'
import { useTheme } from '@/admin/context/ThemeContext'
import { api } from '@/admin/services'

const NAV = [
  {
    group: 'Overview',
    items: [{ to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    group: 'Catalogue',
    items: [
      { to: '/categories', label: 'Categories', icon: Shapes },
      { to: '/products', label: 'Products', icon: Box },
      { to: '/accessories', label: 'Accessories', icon: Package },
      { to: '/variants', label: 'Variants', icon: Layers },
    ],
  },
  {
    group: 'Inbox',
    items: [{ to: '/enquiries', label: 'Enquiries', icon: Inbox, badge: 'newEnquiries' }],
  },
  {
    group: 'Activity',
    items: [{ to: '/history', label: 'History', icon: HistoryIcon }],
  },
  {
    group: 'Access',
    adminOnly: true,
    items: [{ to: '/users', label: 'Users', icon: Users }],
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
            : 'text-muted-foreground hover:bg-black/[.04] dark:hover:bg-white/[.04] hover:text-foreground'
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
  const { user, logout, isAdmin } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Unread-enquiry badge — reads the shared enquiries cache, so triage
  // actions in the inbox update it instantly (via invalidation). Enquiries
  // are visitor-submitted (no console mutation ever invalidates them), so a
  // slow poll keeps the badge honest while the console sits open.
  const { data: newEnquiries = 0 } = useQuery({
    queryKey: [api.enquiries.key],
    queryFn: () => api.enquiries.list(),
    select: (items) => items.filter((e) => e.status === 'new').length,
    refetchInterval: 60_000,
  })
  const badges = { newEnquiries }

  useEffect(() => setMobileOpen(false), [location.pathname])

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 pb-6 pt-6">
        <NavLink to="/" className="flex items-center gap-3">
          <img src="/admin/radium-logo-light.svg" alt="Radium" className="h-8 w-auto dark:hidden" />
          <img src="/admin/radium-logo-dark.svg" alt="Radium" className="hidden h-8 w-auto dark:block" />
          <span className="rounded-md border border-beam/30 bg-beam/10 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-beam">
            Admin
          </span>
        </NavLink>
        <button
          type="button"
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-4.5 w-4.5" />
        </button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
        {NAV.filter((section) => !section.adminOnly || isAdmin).map((section) => (
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

      <div className="border-t border-black/[.08] dark:border-white/[.07] p-4">
        <div className="flex items-center gap-3 rounded-xl bg-black/[.03] dark:bg-white/[.03] p-3">
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
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] border-r border-black/[.07] bg-white/75 backdrop-blur-[14px] dark:border-white/[.07] dark:bg-[rgba(18,4,6,.72)] lg:block">
        {sidebar}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm dark:bg-[#0a0305]/70" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[280px] animate-dropdown-in border-r border-black/[.07] bg-white shadow-card dark:border-white/[.07] dark:bg-[#160507]">
            {sidebar}
          </aside>
        </div>
      ) : null}

      {/* Topbar */}
      <header className="sticky top-0 z-30 border-b border-black/[.07] bg-white/75 backdrop-blur-[14px] dark:border-white/[.07] dark:bg-[rgba(18,4,6,.72)]">
        <div className="flex h-16 items-center gap-4 px-5 md:px-8">
          <button
            type="button"
            className="rounded-lg p-2 text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
          <p className="hidden text-[13px] text-muted-foreground sm:block">
            Product console
          </p>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-full border border-black/[.12] p-2 text-muted-foreground transition-all hover:border-beam/40 hover:text-foreground dark:border-white/12"
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <a
              href="https://radium-computers.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-black/[.12] px-4 py-2 text-[12.5px] font-semibold text-muted-foreground transition-all hover:border-beam/40 hover:text-foreground dark:border-white/12"
            >
              View site
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </header>

      <main className="px-5 py-8 md:px-8 lg:py-10">
        <div className="mx-auto w-full max-w-[1400px] animate-fade-up">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
