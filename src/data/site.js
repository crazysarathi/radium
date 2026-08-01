/**
 * Site-wide chrome: navigation and company stats.
 *
 * The five category links (Compute → Edge & IoMT) are NOT declared here —
 * `Header.jsx` renders them from the fetched catalogue categories (via
 * `useCatalogue()`), so an admin's label edits flow straight through. This
 * file only keeps the nav items that stay static while the catalogue loads.
 */

export const navLinks = [
  { label: 'Company', to: '/company' },
]

export const stats = [
  { value: '12', label: 'Product families' },
  { value: '24', label: 'Bays per Jupiter chassis' },
  { value: '99.999%', label: 'Uptime target' },
  { value: '24×7', label: 'Escalation path' },
]
