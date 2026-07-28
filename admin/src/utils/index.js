import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs) => twMerge(clsx(inputs))

export const uid = (prefix = 'id') =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`

export const slugify = (s) =>
  String(s)
    .toLowerCase()
    .trim()
    .replace(/['".]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** 8 -> "8 TB", 1024 -> "1.0 PB" — same helper the client site uses. */
export const formatCapacity = (tb) => {
  if (tb >= 1000) return `${(tb / 1000).toFixed(tb % 1000 === 0 ? 0 : 1)} PB`
  return `${tb} TB`
}

/**
 * Jupiter SS model number scheme (mirrors the client's decoder):
 * bays / drive capacity (TB) / drives installed, two digits each.
 */
export const decodeModelNumber = (code) => {
  const digits = String(code).replace(/\D/g, '')
  if (digits.length !== 6) return null
  const bays = parseInt(digits.slice(0, 2), 10)
  const driveCapacityTb = parseInt(digits.slice(2, 4), 10)
  const drivesInstalled = parseInt(digits.slice(4, 6), 10)
  return {
    bays,
    driveCapacityTb,
    drivesInstalled,
    rawCapacityTb: driveCapacityTb * drivesInstalled,
    baysFree: bays - drivesInstalled,
    valid: drivesInstalled <= bays,
  }
}

export const formatDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const formatDateTime = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
}

/** "3h ago" / "2d ago" for the activity feed. */
export const timeAgo = (iso) => {
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return '—'
  const s = Math.max(0, (Date.now() - t) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  if (s < 86400 * 30) return `${Math.floor(s / 86400)}d ago`
  return formatDate(iso)
}

/** Read a File as a data URL (mock uploads). Rejects files over `maxKb`. */
export const fileToDataUrl = (file, maxKb = 400) =>
  new Promise((resolve, reject) => {
    if (file.size > maxKb * 1024) {
      reject(new Error(`Image is ${Math.round(file.size / 1024)} KB — keep mock uploads under ${maxKb} KB.`))
      return
    }
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Could not read the file.'))
    reader.readAsDataURL(file)
  })
