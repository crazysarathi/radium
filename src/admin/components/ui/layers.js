/**
 * Shared overlay plumbing for stacked layers (a Modal opened inside a Sheet).
 *
 * - Escape must close only the TOP layer: each overlay registers on a stack
 *   and one document listener dispatches Escape to the most recent entry.
 * - The body scroll lock is reference-counted so closing a nested overlay
 *   doesn't unlock scrolling behind one that is still open.
 */

const escStack = []

function onKeydown(e) {
  if (e.key !== 'Escape' || escStack.length === 0) return
  escStack[escStack.length - 1]()
}

/** Register an overlay's Escape handler. Returns its release function. */
export function pushEscLayer(onEscape) {
  if (escStack.length === 0) document.addEventListener('keydown', onKeydown)
  escStack.push(onEscape)
  return () => {
    const i = escStack.indexOf(onEscape)
    if (i !== -1) escStack.splice(i, 1)
    if (escStack.length === 0) document.removeEventListener('keydown', onKeydown)
  }
}

let scrollLocks = 0

/** Lock body scroll for one overlay. Returns its release function. */
export function lockBodyScroll() {
  scrollLocks += 1
  if (scrollLocks === 1) document.body.style.overflow = 'hidden'
  let released = false
  return () => {
    if (released) return
    released = true
    scrollLocks = Math.max(0, scrollLocks - 1)
    if (scrollLocks === 0) document.body.style.overflow = ''
  }
}
