import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'
import { cn, uid } from '@/utils'

const ToastContext = createContext(null)

const ICONS = { success: CheckCircle2, error: AlertTriangle, info: Info }
const TONES = {
  success: 'border-beam/35 text-beam',
  error: 'border-destructive/50 text-destructive',
  info: 'border-white/20 text-foreground/80',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
    clearTimeout(timers.current[id])
    delete timers.current[id]
  }, [])

  const push = useCallback(
    (type, title, message) => {
      const id = uid('toast')
      setToasts((t) => [...t.slice(-3), { id, type, title, message }])
      timers.current[id] = setTimeout(() => dismiss(id), 4200)
    },
    [dismiss]
  )

  const value = useMemo(
    () => ({
      success: (title, message) => push('success', title, message),
      error: (title, message) => push('error', title, message),
      info: (title, message) => push('info', title, message),
    }),
    [push]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[90] flex w-[min(92vw,380px)] flex-col gap-2.5">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.type] ?? Info
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
                className={cn(
                  'pointer-events-auto flex items-start gap-3 rounded-glass border bg-[rgba(30,12,14,.92)] p-4 shadow-card backdrop-blur-[12px]',
                  TONES[t.type] ?? TONES.info
                )}
              >
                <Icon className="mt-0.5 h-4.5 w-4.5 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-bold text-foreground">{t.title}</p>
                  {t.message ? (
                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted-foreground">{t.message}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(t.id)}
                  className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                  aria-label="Dismiss"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
