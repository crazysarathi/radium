import { Plus, PenLine, Trash2, HistoryIcon } from 'lucide-react'
import { api } from '@/admin/services'
import { useCollection } from '@/admin/hooks/useCollection'
import { useListControls } from '@/admin/hooks/useListControls'
import { timeAgo, cn } from '@/admin/utils'
import {
  PageHeader, SearchInput, FilterChips, Toolbar, Pagination,
  EmptyState, DataTable, Badge,
} from '@/admin/components/ui'

const ACT_ICON = { create: Plus, update: PenLine, delete: Trash2 }
const ACT_TONE = {
  create: 'border-emerald-400/35 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300',
  update: 'border-beam/35 bg-beam/10 text-beam',
  delete: 'border-destructive/40 bg-destructive/10 text-destructive',
}
const ACT_BADGE = { create: 'success', update: 'beam', delete: 'destructive' }
const TYPES = [
  { value: 'create', label: 'Created' },
  { value: 'update', label: 'Updated' },
  { value: 'delete', label: 'Deleted' },
]

export default function History() {
  const { items } = useCollection(api.activity)

  const controls = useListControls(items, { searchKeys: ['label', 'module', 'type'], pageSize: 15 })

  const typeFilters = [
    { value: 'all', label: 'All', count: items?.length },
    ...TYPES.map((t) => ({ ...t, count: items?.filter((a) => a.type === t.value).length })),
  ]

  return (
    <>
      <PageHeader
        eyebrow="Activity"
        title="History"
        body="Every create, update and delete made in this console, newest first — the latest 40 events."
      />

      <Toolbar>
        <SearchInput value={controls.query} onChange={controls.setQuery} placeholder="Search history…" className="w-full sm:w-72" />
        <FilterChips options={typeFilters} value={controls.filters.type ?? 'all'} onChange={(v) => controls.setFilter('type', v)} />
      </Toolbar>

      <DataTable
        columns={[
          {
            key: 'label',
            label: 'Event',
            className: 'w-full max-w-0',
            render: (a) => {
              const Icon = ACT_ICON[a.type] ?? PenLine
              return (
                <div className="flex items-center gap-3.5">
                  <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border', ACT_TONE[a.type] ?? ACT_TONE.update)}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <p className="truncate text-foreground/90">{a.label}</p>
                </div>
              )
            },
          },
          {
            key: 'module',
            label: 'Module',
            align: 'center',
            render: (a) => <Badge tone="muted" className="whitespace-nowrap">{a.module}</Badge>,
          },
          {
            key: 'type',
            label: 'Type',
            align: 'center',
            render: (a) => (
              <Badge variant={ACT_BADGE[a.type] ?? 'beam'}>
                {TYPES.find((t) => t.value === a.type)?.label ?? a.type}
              </Badge>
            ),
          },
          {
            key: 'at',
            label: 'When',
            align: 'center',
            className: 'whitespace-nowrap text-[12.5px] text-muted-foreground',
            render: (a) => timeAgo(a.at),
          },
        ]}
        rows={controls.pageItems}
        loading={items === null}
        empty={
          <EmptyState
            icon={HistoryIcon}
            title="No history"
            body={controls.query || controls.filters.type ? 'No event matches that search.' : 'Changes you make in the console will show up here.'}
          />
        }
      />

      <Pagination page={controls.page} pages={controls.pages} total={controls.total} onPage={controls.setPage} />
    </>
  )
}
