import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/context/ToastContext'

/** Binds a single-record document service (company page, footer, …). */
export function useDocument(service) {
  const [doc, setDoc] = useState(null)
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  useEffect(() => {
    let alive = true
    service.get().then((d) => {
      if (alive) setDoc(d)
    })
    return () => {
      alive = false
    }
  }, [service])

  const save = useCallback(
    async (patch, message) => {
      setSaving(true)
      try {
        const next = await service.update(patch)
        setDoc(next)
        toast.success('Saved', message ?? `${service.label} updated.`)
        return true
      } catch (e) {
        toast.error('Save failed', e.message)
        return false
      } finally {
        setSaving(false)
      }
    },
    [service, toast]
  )

  return { doc, setDoc, loading: doc === null, saving, save }
}
