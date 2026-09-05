import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Users, PenLine, Trash2, ShieldCheck, PenTool, Eye } from 'lucide-react'
import { api } from '@/admin/services'
import { useAuth } from '@/admin/context/AuthContext'
import { useCollection } from '@/admin/hooks/useCollection'
import { useListControls } from '@/admin/hooks/useListControls'
import { formatDate, timeAgo } from '@/admin/utils'
import {
  PageHeader, Button, DataTable, SearchInput, FilterChips, Toolbar,
  Pagination, EmptyState, Badge, ConfirmDialog, Toggle,
} from '@/admin/components/ui'

const ROLES = [
  { value: 'admin', label: 'Administrator', icon: ShieldCheck, variant: 'beam' },
  { value: 'editor', label: 'Editor', icon: PenTool, variant: 'warning' },
  { value: 'viewer', label: 'Viewer', icon: Eye, variant: 'muted' },
]

export function RoleBadge({ role, label }) {
  const def = ROLES.find((r) => r.value === role)
  return <Badge variant={def?.variant ?? 'muted'}>{label ?? def?.label ?? role}</Badge>
}

export default function UsersList() {
  const navigate = useNavigate()
  const { user: me } = useAuth()
  const { items, loading, update, remove } = useCollection(api.users)
  const controls = useListControls(items, { searchKeys: ['full_name', 'email', 'role', 'role_display'], pageSize: 8 })
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const isSelf = (u) => u.id === me?.id

  const roleFilters = [
    { value: 'all', label: 'All', count: items?.length },
    ...ROLES.map((r) => ({
      value: r.value,
      label: r.label,
      icon: r.icon,
      count: items?.filter((u) => u.role === r.value).length,
    })),
  ]

  const columns = [
    {
      key: 'full_name',
      label: 'User',
      className: 'w-full max-w-0',
      render: (u) => (
        <div className="flex items-center gap-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-grad font-mono text-[12px] font-bold text-[#26060a]">
            {u.initials}
          </span>
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-semibold text-foreground">
              <span className="truncate">{u.full_name}</span>
              {isSelf(u) ? <Badge variant="beam">You</Badge> : null}
            </p>
            <p className="truncate text-[12px] text-muted-foreground">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (u) => <RoleBadge role={u.role} label={u.role_display} />,
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (u) => (
        <div className="flex items-center gap-3 whitespace-nowrap">
          <Toggle
            checked={u.is_active}
            disabled={isSelf(u)}
            onChange={(on) =>
              update(u.id, { is_active: on }, `${u.full_name} is now ${on ? 'active' : 'deactivated'}.`)
            }
          />
          <Badge variant={u.is_active ? 'success' : 'muted'}>{u.is_active ? 'Active' : 'Inactive'}</Badge>
        </div>
      ),
    },
    {
      key: 'last_login_at',
      label: 'Last sign-in',
      className: 'whitespace-nowrap text-muted-foreground',
      render: (u) => (u.last_login_at ? timeAgo(u.last_login_at) : 'Never'),
    },
    {
      key: 'created_at',
      label: 'Created',
      className: 'whitespace-nowrap text-muted-foreground',
      render: (u) => formatDate(u.created_at),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: 110,
      align: 'center',
      render: (u) => (
        <div className="flex justify-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/users/${u.id}/edit`)
            }}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-beam/10 hover:text-beam"
            aria-label={`Edit ${u.full_name}`}
          >
            <PenLine className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={isSelf(u)}
            onClick={(e) => {
              e.stopPropagation()
              setToDelete(u)
            }}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
            aria-label={isSelf(u) ? 'You cannot delete your own account' : `Delete ${u.full_name}`}
            title={isSelf(u) ? 'You cannot delete your own account' : undefined}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Access"
        title="Users"
        body="Who can sign in to this console and what they are allowed to touch. Administrators manage everything, editors change content, viewers only read."
        actions={
          <Button to="/users/new">
            <Plus className="h-4 w-4" />
            Add user
          </Button>
        }
      />

      <Toolbar>
        <SearchInput value={controls.query} onChange={controls.setQuery} placeholder="Search users…" className="w-full sm:w-72" />
        <FilterChips options={roleFilters} value={controls.filters.role ?? 'all'} onChange={(v) => controls.setFilter('role', v)} />
      </Toolbar>

      <DataTable
        columns={columns}
        rows={controls.pageItems}
        loading={loading}
        onRowClick={(u) => navigate(`/users/${u.id}/edit`)}
        empty={
          <EmptyState
            icon={Users}
            title="No users found"
            body={controls.query ? 'No user matches that search.' : 'Add a teammate to give them access to the console.'}
            action={
              <Button to="/users/new" size="sm">
                <Plus className="h-4 w-4" /> Add user
              </Button>
            }
          />
        }
      />

      <Pagination page={controls.page} pages={controls.pages} total={controls.total} onPage={controls.setPage} />

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        busy={deleting}
        onConfirm={async () => {
          setDeleting(true)
          await remove(toDelete.id, `${toDelete.full_name} can no longer sign in.`)
          setDeleting(false)
          setToDelete(null)
        }}
        title={`Delete ${toDelete?.full_name}?`}
        message={`${toDelete?.email} loses access to the console immediately and any active sessions are revoked.`}
      />
    </>
  )
}
