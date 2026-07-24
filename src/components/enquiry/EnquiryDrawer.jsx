import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingCart, ArrowRight, Trash2 } from 'lucide-react'
import { accessoriesFor, useEnquiry } from './EnquiryContext'

/**
 * Slide-over enquiry tray. Opens from the cart button in the header; quantities
 * are editable in place, accessories used with the listed products are offered
 * below the items, and "Send enquiry" carries the list to the contact form.
 */
export default function EnquiryDrawer() {
  const enquiry = useEnquiry()
  const navigate = useNavigate()

  useEffect(() => {
    if (!enquiry?.drawerOpen) return
    const onKey = (e) => e.key === 'Escape' && enquiry.closeDrawer()
    window.addEventListener('keydown', onKey)
    // Freeze the page behind the sheet: hide the window scrollbar and pause
    // Lenis so wheel/touch input can't move the main scroll underneath.
    document.documentElement.style.overflow = 'hidden'
    window.__lenis?.stop()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
      window.__lenis?.start()
    }
  }, [enquiry])

  if (!enquiry) return null

  // Accessories used with the products/models already in the list, minus the
  // ones the list already holds — added ones move up into the items above.
  const families = [...new Set(enquiry.items.map((i) => i.family).filter(Boolean))]
  const suggested = families
    .flatMap((f) => accessoriesFor(f))
    .filter((a, idx, arr) => arr.findIndex((x) => x.id === a.id) === idx)
    .filter((a) => !enquiry.has(`acc:${a.id}`))

  const send = () => {
    enquiry.closeDrawer()
    navigate('/contact')
  }

  return (
    <AnimatePresence>
      {enquiry.drawerOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
          onClick={enquiry.closeDrawer}
        >
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-white/[.08] bg-[#120406]/97 backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Enquiry list"
          >
            <div className="flex items-center justify-between border-b border-white/[.07] px-6 py-5">
              <h2 className="flex items-center gap-2.5 text-[17px] font-bold text-foreground">
                <ShoppingCart className="h-[18px] w-[18px] text-beam" />
                Enquiry list
                {enquiry.count > 0 && (
                  <span className="rounded-full bg-beam/15 px-2 py-0.5 text-[12px] font-semibold text-beam">
                    {enquiry.count}
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={enquiry.closeDrawer}
                aria-label="Close"
                className="rounded-lg border border-white/10 p-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-6 py-5">
              {enquiry.items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingCart className="h-10 w-10 text-muted-foreground/40" />
                  <p className="mt-4 text-sm font-semibold text-foreground">Nothing here yet</p>
                  <p className="mt-2 max-w-[240px] text-[13px] leading-relaxed text-muted-foreground">
                    Open a product page and add it to the enquiry — the accessories used
                    with it will show up here.
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {enquiry.items.map((i) => (
                    <li key={i.id} className="rounded-xl border border-white/[.08] bg-[#1a0709]/50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[13.5px] font-semibold leading-snug text-foreground">{i.name}</p>
                          {i.meta && <p className="mt-1 font-mono text-[11.5px] text-muted-foreground">{i.meta}</p>}
                        </div>
                        <button
                          type="button"
                          onClick={() => enquiry.remove(i.id)}
                          aria-label={`Remove ${i.name}`}
                          className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-beam"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => enquiry.setQty(i.id, i.qty - 1)}
                          aria-label={`Decrease quantity of ${i.name}`}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 text-muted-foreground transition-colors hover:border-beam/40 hover:text-beam"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-[2rem] text-center font-mono text-sm font-semibold text-foreground">
                          {i.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => enquiry.setQty(i.id, i.qty + 1)}
                          aria-label={`Increase quantity of ${i.name}`}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 text-muted-foreground transition-colors hover:border-beam/40 hover:text-beam"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {suggested.length > 0 && (
                <div className="mt-7">
                  <p className="text-[11.5px] font-semibold uppercase tracking-[.14em] text-beam/70">
                    Accessories used with this product
                  </p>
                  <ul className="mt-3 space-y-2">
                    {suggested.map((a) => (
                      <li
                        key={a.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/[.07] bg-[#1a0709]/35 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold text-foreground">{a.name}</p>
                          <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{a.sku}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => enquiry.add({ id: `acc:${a.id}`, name: a.name, meta: a.sku })}
                          aria-label={`Add ${a.name} to enquiry`}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-beam/40 bg-beam/10 text-beam transition-colors hover:bg-beam/20"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {enquiry.items.length > 0 && (
              <div className="border-t border-white/[.07] px-6 py-5">
                <button
                  type="button"
                  onClick={send}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-grad px-6 py-3 text-sm font-semibold text-[#26060a] shadow-glow transition-all hover:shadow-glow-lg"
                >
                  Send enquiry <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={enquiry.clear}
                  className="mt-3 w-full text-center text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  Clear list
                </button>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
