import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/context/ToastContext'

/**
 * Binds a collection service to component state and wires every mutation to
 * toasts. `items === null` means the first load is still in flight.
 */
export function useCollection(service) {
  const [items, setItems] = useState(null)
  const [error, setError] = useState(null)
  const toast = useToast()

  const refresh = useCallback(async () => {
    try {
      setError(null)
      setItems(await service.list())
    } catch (e) {
      setError(e.message ?? 'Failed to load.')
    }
  }, [service])

  useEffect(() => {
    refresh()
  }, [refresh])

  const run = useCallback(
    async (fn, successTitle, successMessage) => {
      try {
        const result = await fn()
        toast.success(successTitle, successMessage)
        await refresh()
        return result ?? true
      } catch (e) {
        toast.error('Something went wrong', e.message)
        return false
      }
    },
    [toast, refresh]
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

  return { items, loading: items === null, error, refresh, create, update, remove }
}
