import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Inbox, Trash2, Mail, Phone, Building2, Clock } from 'lucide-react'
import { api } from '@/admin/services'
import { useCollection } from '@/admin/hooks/useCollection'
import { useListControls } from '@/admin/hooks/useListControls'
import { formatDateTime, timeAgo, cn } from '@/admin/utils'
import {
  PageHeader, DataTable, SearchInput, FilterChips, Toolbar, Pagination,
  EmptyState, ConfirmDialog, Modal, StatusBadge, Button,
} from '@/admin/components/ui'

const STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'replied', label: 'Replied' },
  { value: 'closed', label: 'Closed' },
]

function EnquiryDetail({ enquiry, products, onStatus, onDelete, onClose }) {
  if (!enquiry) return null
  const product = products?.find((p) => p.slug === enquiry.interest)

  return (
    <Modal open onClose={onClose} wide title={enquiry.name} subtitle={`Received ${formatDateTime(enquiry.receivedAt)}`}>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-black/[.08] dark:border-white/[.08] bg-black/[.02] dark:bg-white/[.02] p-3.5">
          <p className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-[.14em] text-muted-foreground">
            <Building2 className="h-3 w-3" /> Organisation
          </p>
          <p className="mt-1.5 text-[13px] font-semibold text-foreground">{enquiry.org || '—'}</p>
        </div>
        <div className="rounded-xl border border-black/[.08] dark:border-white/[.08] bg-black/[.02] dark:bg-white/[.02] p-3.5">
          <p className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-[.14em] text-muted-foreground">
            <Mail className="h-3 w-3" /> Email
          </p>
          <a href={`mailto:${enquiry.email}`} className="mt-1.5 block truncate text-[13px] font-semibold text-beam hover:underline">
            {enquiry.email}
          </a>
        </div>
        <div className="rounded-xl border border-black/[.08] dark:border-white/[.08] bg-black/[.02] dark:bg-white/[.02] p-3.5">
          <p className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-[.14em] text-muted-foreground">
            <Phone className="h-3 w-3" /> Phone
          </p>
          <p className="mt-1.5 text-[13px] font-semibold text-foreground">{enquiry.phone || '—'}</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-beam/20 bg-beam/[.05] p-4">
        <p className="text-[10.5px] uppercase tracking-[.14em] text-muted-foreground">Interested in</p>
        <p className="mt-1 text-[14px] font-bold text-foreground">
          {product ? `${product.name} — ${product.tagline}` : enquiry.interest}
        </p>
      </div>

      <div className="mt-4">
        <p className="t-eyebrow text-[10px] text-beam/70">Requirement</p>
        <p className="mt-2 whitespace-pre-wrap rounded-xl border border-black/[.08] dark:border-white/[.08] bg-black/[.03] dark:bg-[#1a0709]/50 p-4 text-[13.5px] leading-relaxed text-foreground/90">
          {enquiry.message}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => onStatus(enquiry, s.value)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-all',
                enquiry.status === s.value
                  ? 'border-beam/60 bg-beam/15 text-beam shadow-glow'
                  : 'border-black/10 dark:border-white/10 text-muted-foreground hover:border-beam/30 hover:text-foreground'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        <Button variant="destructive" size="sm" onClick={() => onDelete(enquiry)}>
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      </div>
    </Modal>
  )
}

export default function EnquiriesList() {
  const { items, loading, update, remove } = useCollection(api.enquiries)
  const controls = useListControls(items, { searchKeys: ['name', 'org', 'email', 'message', 'interest'], pageSize: 8 })
  const [openId, setOpenId] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const { data: products = [] } = useQuery({
    queryKey: [api.products.key],
    queryFn: () => api.products.list(),
  })

  const open = items?.find((e) => e.id === openId) ?? null

  const statusFilters = [
    { value: 'all', label: 'All', count: items?.length },
    ...STATUSES.map((s) => ({ ...s, count: items?.filter((e) => e.status === s.value).length })),
  ]

  const columns = [
    {
      key: 'name',
      label: 'From',
      render: (e) => (
        <div>
          <p className={cn('font-semibold', e.status === 'new' ? 'text-foreground' : 'text-foreground/75')}>{e.name}</p>
          <p className="text-[12px] text-muted-foreground">{e.org}</p>
        </div>
      ),
    },
    {
      key: 'interest',
      label: 'Interest',
      render: (e) => {
        const p = products.find((x) => x.slug === e.interest)
        return <span className="text-[12.5px] text-muted-foreground">{p?.name ?? e.interest}</span>
      },
    },
    {
      key: 'receivedAt',
      label: 'Received',
      render: (e) => (
        <span className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
          <Clock className="h-3 w-3 opacity-60" />
          {timeAgo(e.receivedAt)}
        </span>
      ),
    },
    { key: 'status', label: 'Status', render: (e) => <StatusBadge status={e.status} /> },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Inbox"
        title="Enquiries"
        body="Quote requests from the contact form, newest first."
      />

      <Toolbar>
        <SearchInput value={controls.query} onChange={controls.setQuery} placeholder="Search enquiries…" className="w-full sm:w-72" />
        <FilterChips options={statusFilters} value={controls.filters.status ?? 'all'} onChange={(v) => controls.setFilter('status', v)} />
      </Toolbar>

      <DataTable
        columns={columns}
        rows={controls.pageItems}
        loading={loading}
        onRowClick={(e) => {
          setOpenId(e.id)
          if (e.status === 'new') update(e.id, { status: 'replied' }, `Enquiry from ${e.name} marked as replied.`)
        }}
        empty={
          <EmptyState
            icon={Inbox}
            title="Inbox zero"
            body={controls.query ? 'No enquiry matches that search.' : 'No enquiries yet — they arrive from the contact form.'}
          />
        }
      />

      <Pagination page={controls.page} pages={controls.pages} total={controls.total} onPage={controls.setPage} />

      {open ? (
        <EnquiryDetail
          enquiry={open}
          products={products}
          onClose={() => setOpenId(null)}
          onStatus={(e, status) => update(e.id, { status }, `Enquiry from ${e.name} marked as ${status}.`)}
          onDelete={(e) => {
            setOpenId(null)
            setToDelete(e)
          }}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        busy={deleting}
        onConfirm={async () => {
          setDeleting(true)
          await remove(toDelete.id, `Enquiry from ${toDelete.name} deleted.`)
          setDeleting(false)
          setToDelete(null)
        }}
        title="Delete this enquiry?"
        message={`The enquiry from ${toDelete?.name} (${toDelete?.org}) is permanently removed from the inbox.`}
      />
    </>
  )
}
