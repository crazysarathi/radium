import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, AlertTriangle } from 'lucide-react'
import { cn } from '@/utils'
import { Button } from './button'

export function Modal({ open, onClose, title, subtitle, wide = false, children }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] flex items-end justify-center overflow-y-auto bg-[#0a0305]/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
            className={cn(
              'glass max-h-[92vh] w-full overflow-y-auto rounded-b-none rounded-t-glass shadow-card sm:rounded-glass',
              wide ? 'sm:max-w-3xl' : 'sm:max-w-xl'
            )}
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === 'string' ? title : undefined}
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/[.07] bg-[rgba(26,7,9,.92)] px-6 py-4 backdrop-blur-[12px]">
              <div>
                <h2 className="t-h3 text-foreground">{title}</h2>
                {subtitle ? <p className="mt-0.5 text-[12.5px] text-muted-foreground">{subtitle}</p> : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <div className="px-6 py-6">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  )
}

/** Destructive-action gate used by every delete. */
export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Delete', busy = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title ?? 'Are you sure?'}>
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-destructive/40 bg-destructive/10">
          <AlertTriangle className="h-4.5 w-4.5 text-destructive" />
        </span>
        <p className="text-[13.5px] leading-relaxed text-muted-foreground">{message}</p>
      </div>
      <div className="mt-7 flex justify-end gap-3">
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="destructive" size="sm" loading={busy} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
