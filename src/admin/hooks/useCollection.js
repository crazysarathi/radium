import { useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/admin/context/ToastContext'

/**
 * Binds a collection service to the shared React Query cache and wires every
 * mutation to toasts. Lists are cached per service key, so navigating between
 * pages reuses data instead of refetching on every click; every mutation
 * invalidates the collection so all mounted consumers refresh together.
 * `items === null` means the first load is still in flight.
 */
export function useCollection(service) {
  const toast = useToast()
  const queryClient = useQueryClient()
  const queryKey = [service.key]

  const { data, error, refetch } = useQuery({
    queryKey,
    queryFn: () => service.list(),
  })

  const refresh = useCallback(() => refetch(), [refetch])

  const run = useCallback(
    async (fn, successTitle, successMessage) => {
      try {
        const result = await fn()
        toast.success(successTitle, successMessage)
        // The server writes an activity-log entry on every mutation, so the
        // history feed is invalidated together with the mutated collection.
        await Promise.all([
          queryClient.invalidateQueries({ queryKey }),
          service.key !== '/activity' &&
            queryClient.invalidateQueries({ queryKey: ['/activity'] }),
        ])
        return result ?? true
      } catch (e) {
        toast.error('Something went wrong', e.message)
        return false
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [toast, queryClient, service.key]
  )

  const create = useCallback(
    (data, msg) => run(() => service.create(data), 'Created', msg),
    [run, service]
  )
  const update = useCallback(
    (id, patch, msg) => run(() => service.update(id, patch), 'Saved', msg),
    [run, service]
  )
  const remove = useCallback(
    (id, msg) => run(() => service.remove(id), 'Deleted', msg),
    [run, service]
  )

  return {
    items: data ?? null,
    loading: data === undefined,
    error: error ? (error.message ?? 'Failed to load.') : null,
    refresh,
    create,
    update,
    remove,
  }
}
