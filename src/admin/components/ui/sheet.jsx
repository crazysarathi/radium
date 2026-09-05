import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/admin/utils'
import { pushEscLayer, lockBodyScroll } from './layers'

/**
 * Right-side slide-over for inline management flows (e.g. a product's
 * variants or accessories) that used to be full sub-pages. Sits below the
 * Modal layer (z-80) so forms opened from inside a sheet stack on top of it;
 * Escape and the body scroll lock go through the shared layer stack so a
 * nested Modal closes alone without unlocking scroll behind the sheet.
 */
export function Sheet({ open, onClose, title, subtitle, wide = false, children }) {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return undefined
    const releaseEsc = pushEscLayer(() => onCloseRef.current())
    const releaseScroll = lockBodyScroll()
    return () => {
      releaseEsc()
      releaseScroll()
    }
  }, [open])

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[75] bg-black/45 dark:bg-[#0a0305]/70 backdrop-blur-sm"
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.34, ease: [0.2, 0.7, 0.2, 1] }}
            className={cn(
              'glass fixed inset-y-0 right-0 flex w-full flex-col rounded-none shadow-card',
              wide ? 'sm:max-w-3xl' : 'sm:max-w-2xl'
            )}
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === 'string' ? title : undefined}
          >
            <div className="flex items-start justify-between gap-4 border-b border-black/[.08] dark:border-white/[.07] bg-white/[.92] dark:bg-[rgba(26,7,9,.92)] px-6 py-4 backdrop-blur-[12px]">
              <div className="min-w-0">
                <h2 className="t-h3 truncate text-foreground">{title}</h2>
                {subtitle ? <p className="mt-0.5 text-[12.5px] text-muted-foreground">{subtitle}</p> : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  )
}
